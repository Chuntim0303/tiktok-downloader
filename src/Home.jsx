import React, { useState, useEffect } from 'react';

const Home = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [downloadReady, setDownloadReady] = useState(false);
  const [videoInfo, setVideoInfo] = useState(null);
  const [showManualOptions, setShowManualOptions] = useState(false);

  // API endpoint from environment variables
  const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT;

  // Google Analytics tracking function
  const trackEvent = (eventName, parameters = {}) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', eventName, parameters);
    }
  };

  // Track page view on component mount
  useEffect(() => {
    trackEvent('page_view', {
      page_title: 'TikTok Downloader',
      page_location: window.location.href
    });
  }, []);

  // CORS proxies for client-side downloads
  const corsProxies = [
    'https://cors-anywhere.herokuapp.com/',
    'https://api.allorigins.win/raw?url=',
    'https://corsproxy.io/?'
  ];

  const validateTikTokUrl = (url) => {
    const patterns = [
      /^https?:\/\/(www\.)?tiktok\.com\/@[\w.-]+\/video\/\d+/,
      /^https?:\/\/(www\.)?tiktok\.com\/v\/\d+/,
      /^https?:\/\/vm\.tiktok\.com\/\w+/,
      /^https?:\/\/vt\.tiktok\.com\/\w+/,
      /^https?:\/\/(www\.)?tiktok\.com\/t\/\w+/
    ];
    return patterns.some(pattern => pattern.test(url));
  };

  const handleDownload = async () => {
    // Track download attempt
    trackEvent('download_started', {
      event_category: 'engagement'
    });

    if (!API_ENDPOINT) {
      setError('Service temporarily unavailable. Please try again later.');
      trackEvent('download_error', {
        event_category: 'error',
        error_type: 'no_api_endpoint'
      });
      return;
    }

    if (!url.trim()) {
      setError('Please enter a TikTok URL');
      trackEvent('download_error', {
        event_category: 'error',
        error_type: 'empty_url'
      });
      return;
    }

    if (!validateTikTokUrl(url)) {
      setError('Please enter a valid TikTok URL');
      trackEvent('download_error', {
        event_category: 'error',
        error_type: 'invalid_url'
      });
      return;
    }

    setLoading(true);
    setError('');
    setDownloadReady(false);
    setVideoInfo(null);
    setShowManualOptions(false);

    try {
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: url.trim() }),
      });

      if (!response.ok) {
        let errorMessage = 'Unable to process video. Please check the URL and try again.';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch {
          errorMessage = 'Server error. Please try again later.';
        }
        
        trackEvent('download_error', {
          event_category: 'error',
          error_type: 'server_error',
          status_code: response.status
        });
        
        throw new Error(errorMessage);
      }

      const contentType = response.headers.get('content-type');
      
      // Handle JSON response (new API format)
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        
        if (data.error) {
          trackEvent('download_error', {
            event_category: 'error',
            error_type: 'api_error'
          });
          throw new Error(data.error);
        }

        if (data.success && data.videoUrl) {
          setVideoInfo({
            title: data.title || 'TikTok Video',
            author: data.author || null,
            thumbnail: data.thumbnail,
            videoUrl: data.videoUrl
          });

          trackEvent('video_extracted', {
            event_category: 'success',
            has_title: !!(data.title && data.title !== 'TikTok Video'),
            has_author: !!data.author
          });

          await attemptClientDownload(data.videoUrl, data.title || 'TikTok Video');
        } else {
          trackEvent('download_error', {
            event_category: 'error',
            error_type: 'invalid_response'
          });
          throw new Error('Invalid response from server');
        }
      } 
      // Handle binary video response (server-side download)
      else if (contentType && contentType.includes('video/mp4')) {
        const blob = await response.blob();
        
        if (blob.size === 0) {
          trackEvent('download_error', {
            event_category: 'error',
            error_type: 'empty_file'
          });
          throw new Error('Received empty video file');
        }

        // Extract metadata from response headers
        const title = response.headers.get('X-Video-Title') || 'TikTok Video';
        const author = response.headers.get('X-Video-Author') || null;

        setVideoInfo({
          title: title,
          author: author !== 'Unknown' ? author : null,
          fileSize: (blob.size / 1024 / 1024).toFixed(1)
        });
        
        // Generate filename and trigger download
        const filename = createFilename(title, url);
        downloadBlob(blob, filename);
        setDownloadReady(true);

        trackEvent('download_completed', {
          event_category: 'success',
          download_method: 'server_side',
          file_size_mb: (blob.size / 1024 / 1024).toFixed(1)
        });
        
      } else {
        trackEvent('download_error', {
          event_category: 'error',
          error_type: 'unexpected_response'
        });
        throw new Error('Unexpected response from server');
      }
    } catch (err) {
      console.error('Download error:', err);
      setError(err.message || 'An error occurred while processing the video');
    } finally {
      setLoading(false);
    }
  };

  const attemptClientDownload = async (videoUrl, title) => {
    try {
      // Try direct download first
      const directResponse = await fetch(videoUrl, { mode: 'cors' });
      
      if (directResponse.ok) {
        const blob = await directResponse.blob();
        if (blob.size > 1000) {
          const filename = createFilename(title, url);
          downloadBlob(blob, filename);
          setDownloadReady(true);
          
          trackEvent('download_completed', {
            event_category: 'success',
            download_method: 'direct',
            file_size_mb: (blob.size / 1024 / 1024).toFixed(1)
          });
          return;
        }
      }
    } catch {
      // Silent fail for direct download
    }

    // Try CORS proxies
    for (let i = 0; i < corsProxies.length; i++) {
      try {
        const proxyUrl = corsProxies[i] + encodeURIComponent(videoUrl);
        
        const response = await fetch(proxyUrl);
        if (response.ok) {
          const blob = await response.blob();
          
          if (blob.size > 1000 && (blob.type.includes('video') || blob.type.includes('application/octet-stream'))) {
            const filename = createFilename(title, url);
            downloadBlob(blob, filename);
            setDownloadReady(true);
            
            trackEvent('download_completed', {
              event_category: 'success',
              download_method: `proxy_${i + 1}`,
              file_size_mb: (blob.size / 1024 / 1024).toFixed(1)
            });
            return;
          }
        }
      } catch {
        // Silent fail for proxy attempts
      }
    }

    // All automatic methods failed, show manual options
    setShowManualOptions(true);
    setError('Download blocked by your browser. Please use the alternative download option below.');
    
    trackEvent('download_fallback', {
      event_category: 'engagement',
      fallback_type: 'manual_options'
    });
  };

  // Download from blob (for binary responses)
  const downloadBlob = (blob, filename) => {
    try {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
      throw new Error('Failed to trigger download');
    }
  };

  // Create a clean filename from video title and URL
  const createFilename = (title, videoUrl) => {
    if (title && title !== 'TikTok Video') {
      const cleanTitle = title
        .replace(/[^a-zA-Z0-9\s-_]/g, '')
        .replace(/\s+/g, '_')
        .substring(0, 50)
        .trim();
      return cleanTitle ? `${cleanTitle}.mp4` : extractFilename(videoUrl);
    }
    return extractFilename(videoUrl);
  };

  // Extract filename from TikTok URL (fallback method)
  const extractFilename = (url) => {
    try {
      const urlObj = new URL(url);
      const pathParts = urlObj.pathname.split('/');
      const videoId = pathParts[pathParts.length - 1];
      return videoId ? `tiktok-${videoId}.mp4` : 'tiktok-video.mp4';
    } catch {
      return 'tiktok-video.mp4';
    }
  };

  const handleInputChange = (e) => {
    setUrl(e.target.value);
    if (error) setError('');
    if (downloadReady) setDownloadReady(false);
    if (videoInfo) setVideoInfo(null);
    if (showManualOptions) setShowManualOptions(false);
  };

  const handleManualDownload = () => {
    trackEvent('manual_download_used', {
      event_category: 'engagement',
      action_type: 'open_video'
    });
    
    if (videoInfo?.videoUrl) {
      window.open(videoInfo.videoUrl, '_blank');
    }
  };

  const handleCopyUrl = () => {
    trackEvent('manual_download_used', {
      event_category: 'engagement',
      action_type: 'copy_url'
    });
    
    if (videoInfo?.videoUrl) {
      navigator.clipboard.writeText(videoInfo.videoUrl).then(() => {
        // Create a temporary success message
        const originalError = error;
        setError('');
        setTimeout(() => {
          if (!originalError) setError('');
        }, 2000);
      });
    }
  };

  const resetForm = () => {
    trackEvent('form_reset', {
      event_category: 'engagement'
    });
    
    setUrl('');
    setError('');
    setDownloadReady(false);
    setVideoInfo(null);
    setShowManualOptions(false);
  };

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Download TikTok Videos
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-500">
              Fast & Free
            </span>
          </h1>
          <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto">
            Save your favorite TikTok videos in high quality. No watermarks, no hassle. 
            Perfect for content creators and personal use.
          </p>

          {/* Download Section */}
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-gray-700/50">
            <div className="mb-6">
              <label htmlFor="tiktok-url" className="block text-sm font-medium text-gray-300 mb-2">
                Enter TikTok URL
              </label>
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  id="tiktok-url"
                  type="url"
                  value={url}
                  onChange={handleInputChange}
                  placeholder="https://www.tiktok.com/@username/video/1234567890"
                  className="flex-1 px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all text-white placeholder-gray-400"
                  disabled={loading}
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleDownload}
                    disabled={loading || !url.trim() || !API_ENDPOINT}
                    className="px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold rounded-lg hover:from-pink-600 hover:to-purple-700 focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    {loading ? (
                      <div className="flex items-center space-x-2">
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <span>Processing...</span>
                      </div>
                    ) : (
                      'Download Video'
                    )}
                  </button>
                  
                  {(videoInfo || error || downloadReady || showManualOptions) && (
                    <button
                      onClick={resetForm}
                      className="px-4 py-3 text-gray-300 hover:text-white font-medium rounded-lg border border-gray-600 hover:bg-gray-700 transition-colors"
                    >
                      New Video
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-4 bg-red-900/30 border border-red-700/50 rounded-lg backdrop-blur-sm">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <p className="text-red-300 text-sm">{error}</p>
                </div>
              </div>
            )}

            {/* Video Info */}
            {videoInfo && (
              <div className="mb-4 p-4 bg-blue-900/30 border border-blue-700/50 rounded-lg backdrop-blur-sm">
                <div className="flex items-start gap-4">
                  {videoInfo.thumbnail && (
                    <img 
                      src={videoInfo.thumbnail} 
                      alt="Video thumbnail"
                      className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                    />
                  )}
                  <div className="flex-1">
                    <h4 className="font-medium text-blue-300 mb-2">Video Ready</h4>
                    <div className="text-sm text-blue-200 space-y-1">
                      {videoInfo.title && videoInfo.title !== 'TikTok Video' && (
                        <p className="font-medium">{videoInfo.title}</p>
                      )}
                      {videoInfo.author && (
                        <p className="text-blue-300">by {videoInfo.author}</p>
                      )}
                      {videoInfo.fileSize && (
                        <p className="text-blue-300">{videoInfo.fileSize} MB</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Manual Download Options */}
            {showManualOptions && videoInfo && (
              <div className="mb-4 p-4 bg-yellow-900/30 border border-yellow-700/50 rounded-lg backdrop-blur-sm">
                <h4 className="font-medium text-yellow-300 mb-3">Alternative Download</h4>
                <p className="text-yellow-200 text-sm mb-4">
                  Your browser security settings prevent automatic downloads. Please use the direct link:
                </p>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={handleManualDownload}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    Open Video
                  </button>
                  <button
                    onClick={handleCopyUrl}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Copy Link
                  </button>
                </div>
                <p className="text-yellow-300 text-xs mt-3">
                  Right-click on the video and select "Save video as..." to download to your device.
                </p>
              </div>
            )}

            {/* Success Message */}
            {downloadReady && (
              <div className="mt-6 p-6 bg-green-900/30 border border-green-700/50 rounded-lg backdrop-blur-sm">
                <div className="text-center">
                  <svg className="w-12 h-12 text-green-400 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <h3 className="text-lg font-semibold text-green-300 mb-2">Download Complete!</h3>
                  <p className="text-green-200">
                    {videoInfo?.title && videoInfo.title !== 'TikTok Video'
                      ? `"${videoInfo.title}" has been saved to your device.`
                      : 'Your TikTok video has been saved to your device.'
                    }
                  </p>
                  {videoInfo?.author && (
                    <p className="text-green-300 text-sm mt-1">
                      by {videoInfo.author}
                    </p>
                  )}
                  <p className="text-green-300 text-sm mt-2">
                    Check your Downloads folder for the video file.
                  </p>
                </div>
              </div>
            )}

            {/* Legal Notice */}
            <div className="mt-6 p-4 bg-amber-900/30 border border-amber-700/50 rounded-lg backdrop-blur-sm">
              <div className="flex items-center justify-center">
                <svg className="w-5 h-5 text-amber-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <p className="text-amber-300 text-sm text-center">
                  <strong>Important:</strong> Only download content you own or have permission to use. 
                  Respect intellectual property rights and TikTok's terms of service.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Why Choose Our Downloader?
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Experience the fastest and most reliable way to download TikTok videos with these amazing features.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: '⚡', title: 'Lightning Fast', description: 'Download videos in seconds with our optimized processing' },
              { icon: '🎯', title: 'High Quality', description: 'Preserve original video quality up to 1080p resolution' },
              { icon: '🚫', title: 'No Watermarks', description: 'Clean videos without TikTok watermarks' },
              { icon: '📱', title: 'Mobile Friendly', description: 'Works perfectly on all devices and screen sizes' },
              { icon: '🔒', title: 'Secure & Private', description: 'Your data is processed securely and never stored' },
              { icon: '💯', title: 'Always Free', description: 'No hidden fees, no registration required' },
            ].map((feature, index) => (
              <div key={index} className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 shadow-2xl hover:shadow-pink-500/10 transition-all duration-300 border border-gray-700/50">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Download your favorite TikTok videos in just three simple steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '1', title: 'Copy URL', description: 'Copy the TikTok video URL from the app or browser' },
              { step: '2', title: 'Paste & Process', description: 'Paste the URL in our tool and click download' },
              { step: '3', title: 'Save Video', description: 'The video will automatically download to your device' },
            ].map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4 shadow-lg">
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{step.title}</h3>
                <p className="text-gray-300">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;