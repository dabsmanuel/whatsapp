/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'
import React, { useState, useEffect } from 'react';
import { Copy, ExternalLink, MessageSquare, Link2, Plus, Trash2, Edit3, Eye, Share2, CheckCircle, AlertCircle, Phone, Building, Zap } from 'lucide-react';

interface Template {
  id: number | null;
  businessName: string;
  phoneNumber: string;
  message: string;
  shortUrl: string;
  whatsappUrl?: string;
  clicks: number;
  createdAt: string;
}

interface MessagePreviewProps {
  message: string;
  businessName: string;
}

const WhatsAppLinkGenerator = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [currentTemplate, setCurrentTemplate] = useState<Template>({
    id: null,
    businessName: '',
    phoneNumber: '',
    message: '',
    shortUrl: '',
    clicks: 0,
    createdAt: new Date().toISOString()
  });
  const [isEditing, setIsEditing] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState('');
  const [activeTab, setActiveTab] = useState('create');
  const [notification, setNotification] = useState<{type: 'success' | 'error', message: string} | null>(null);

  // Load templates from memory on component mount
  useEffect(() => {
    const savedTemplates = JSON.parse(localStorage.getItem('whatsappTemplates') || '[]') as Template[];
    setTemplates(savedTemplates);
  }, []);

  // Save templates to memory whenever templates change
  useEffect(() => {
    localStorage.setItem('whatsappTemplates', JSON.stringify(templates));
  }, [templates]);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const generateShortUrl = (): string => {
    const randomId = Math.random().toString(36).substr(2, 8);
    return `${window.location.origin}/s/${randomId}`;
  };

  const generateWhatsAppUrl = (phoneNumber: string, message: string): string => {
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
  };

  // URL shortener handler
  const handleShortUrlClick = (template: Template) => {
    // Simulate click tracking
    simulateClick(template.id);
    
    // Create a data URL that redirects to WhatsApp
    const redirectHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Redirecting to WhatsApp...</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: Arial, sans-serif; text-align: center; padding: 20px; background: #f0f0f0; margin: 0; }
          .container { max-width: 400px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
          .whatsapp-logo { width: 60px; height: 60px; margin: 0 auto 20px; background: #25D366; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
          .loading { display: inline-block; width: 20px; height: 20px; border: 3px solid #f3f3f3; border-top: 3px solid #25D366; border-radius: 50%; animation: spin 1s linear infinite; }
          @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
          .manual-link { margin-top: 20px; }
          .manual-link a { color: #25D366; text-decoration: none; font-weight: bold; }
          @media (max-width: 480px) {
            .container { padding: 20px; }
            body { padding: 10px; }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="whatsapp-logo">
            <svg width="30" height="30" viewBox="0 0 24 24" fill="white">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.893 3.486"/>
            </svg>
          </div>
          <h2>Redirecting to WhatsApp...</h2>
          <p>You will be redirected to WhatsApp in a moment.</p>
          <div class="loading"></div>
          <div class="manual-link">
            <p>If you're not redirected automatically, <a href="${template.whatsappUrl}" target="_blank">click here</a></p>
          </div>
        </div>
        <script>
          setTimeout(function() {
            window.location.href = "${template.whatsappUrl}";
          }, 2000);
        </script>
      </body>
      </html>
    `;
    
    // Create a blob URL and open it
    const blob = new Blob([redirectHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const newWindow = window.open(url, '_blank');
    
    // Clean up the blob URL after a short delay
    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 5000);
  };

  const handleSubmit = (): void => {
    if (!currentTemplate.businessName || !currentTemplate.phoneNumber || !currentTemplate.message) {
      showNotification('error', 'Please fill in all required fields');
      return;
    }

    const newTemplate: Template = {
      ...currentTemplate,
      id: currentTemplate.id || Date.now(),
      shortUrl: currentTemplate.shortUrl || generateShortUrl(),
      whatsappUrl: generateWhatsAppUrl(currentTemplate.phoneNumber, currentTemplate.message),
      createdAt: currentTemplate.createdAt || new Date().toISOString()
    };

    if (isEditing) {
      setTemplates(templates.map(t => t.id === newTemplate.id ? newTemplate : t));
      showNotification('success', 'Template updated successfully!');
    } else {
      setTemplates([...templates, newTemplate]);
      showNotification('success', 'Template created successfully!');
    }

    resetForm();
    setActiveTab('manage');
  };

  const resetForm = (): void => {
    setCurrentTemplate({
      id: null,
      businessName: '',
      phoneNumber: '',
      message: '',
      shortUrl: '',
      clicks: 0,
      createdAt: new Date().toISOString()
    });
    setIsEditing(false);
    setShowPreview(false);
  };

  const editTemplate = (template: Template): void => {
    setCurrentTemplate(template);
    setIsEditing(true);
    setActiveTab('create');
  };

  const deleteTemplate = (id: number | null): void => {
    if (id === null) return;
    if (confirm('Are you sure you want to delete this template?')) {
      setTemplates(templates.filter(t => t.id !== id));
      showNotification('success', 'Template deleted successfully!');
    }
  };

  const copyToClipboard = (text: string, type: string = 'url'): void => {
    navigator.clipboard.writeText(text);
    setCopiedUrl(text);
    showNotification('success', `${type === 'url' ? 'URL' : 'Content'} copied to clipboard!`);
    setTimeout(() => setCopiedUrl(''), 2000);
  };

  const simulateClick = (templateId: number | null): void => {
    if (templateId === null) return;
    setTemplates(templates.map(t => 
      t.id === templateId ? { ...t, clicks: t.clicks + 1 } : t
    ));
  };

  const MessagePreview: React.FC<MessagePreviewProps> = ({ message, businessName }) => (
    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 sm:p-6 mt-6 shadow-sm">
      <h4 className="font-semibold text-green-800 mb-4 flex items-center">
        <div className="bg-green-100 rounded-lg p-2 mr-3">
          <MessageSquare className="w-5 h-5 text-green-600" />
        </div>
        <span className="text-sm sm:text-base">WhatsApp Message Preview</span>
      </h4>
      <div className="bg-white rounded-xl p-4 shadow-sm border border-green-100">
        <div className="flex items-center mb-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-500 rounded-full flex items-center justify-center mr-3">
            <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <div>
            <div className="font-medium text-gray-800 text-sm sm:text-base">{businessName}</div>
            <div className="text-xs sm:text-sm text-gray-500">Business</div>
          </div>
        </div>
        <div className="bg-green-100 rounded-lg p-3 rounded-bl-none">
          <div className="text-gray-800 text-sm sm:text-base">{message}</div>
        </div>
      </div>
    </div>
  );

  const Notification = () => {
    if (!notification) return null;
    
    return (
      <div className={`fixed top-4 right-4 left-4 sm:left-auto z-50 flex items-center p-4 rounded-lg shadow-lg max-w-sm sm:max-w-none mx-auto sm:mx-0 ${
        notification.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
      }`}>
        {notification.type === 'success' ? (
          <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0" />
        ) : (
          <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
        )}
        <span className="text-sm sm:text-base">{notification.message}</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-green-50">
      <Notification />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white py-8 sm:py-12 lg:py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex flex-col sm:flex-row items-center justify-center mb-4 sm:mb-6">
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-3 sm:p-4 mb-4 sm:mb-0 sm:mr-4">
              <Zap className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-center sm:text-left">
              WhatsApp Link Generator
            </h1>
          </div>
          <p className="text-base sm:text-lg lg:text-xl text-green-100 max-w-2xl mx-auto px-4 sm:px-0">
            Create professional shortened URLs that open WhatsApp with pre-filled messages. 
            Perfect for businesses to streamline customer communication.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 -mt-6 sm:-mt-8">
        {/* Navigation Tabs */}
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 mb-6 sm:mb-8 bg-white rounded-xl p-2 shadow-lg">
          <button
            onClick={() => setActiveTab('create')}
            className={`flex-1 py-3 sm:py-4 px-4 sm:px-6 rounded-lg font-semibold transition-all duration-200 text-sm sm:text-base ${
              activeTab === 'create'
                ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-md'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
            }`}
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5 inline mr-2" />
            Create Template
          </button>
          <button
            onClick={() => setActiveTab('manage')}
            className={`flex-1 py-3 sm:py-4 px-4 sm:px-6 rounded-lg font-semibold transition-all duration-200 text-sm sm:text-base ${
              activeTab === 'manage'
                ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-md'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
            }`}
          >
            <Eye className="w-4 h-4 sm:w-5 sm:h-5 inline mr-2" />
            Manage Templates
            <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full">
              {templates.length}
            </span>
          </button>
        </div>

        {/* Create Template Tab */}
        {activeTab === 'create' && (
          <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center mb-6 sm:mb-8">
              <div className="bg-green-100 rounded-xl p-3 mb-4 sm:mb-0 sm:mr-4 self-start">
                <Link2 className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800">
                  {isEditing ? 'Edit Template' : 'Create New Template'}
                </h2>
                <p className="text-gray-600 mt-1 text-sm sm:text-base">
                  {isEditing ? 'Update your existing template' : 'Build a new WhatsApp link with custom message'}
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
              <div className="space-y-4 sm:space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                    <Building className="w-4 h-4 inline mr-2" />
                    Business Name *
                  </label>
                  <input
                    type="text"
                    value={currentTemplate.businessName}
                    onChange={(e) => setCurrentTemplate({...currentTemplate, businessName: e.target.value})}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white text-sm sm:text-base text-gray-700"
                    placeholder="e.g., Sarah's Boutique"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                    <Phone className="w-4 h-4 inline mr-2" />
                    WhatsApp Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={currentTemplate.phoneNumber}
                    onChange={(e) => setCurrentTemplate({...currentTemplate, phoneNumber: e.target.value})}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white text-sm sm:text-base text-gray-700"
                    placeholder="e.g., +1234567890"
                    required
                  />
                  <p className="text-xs sm:text-sm text-gray-500 mt-2 bg-blue-50 p-2 rounded-lg">
                    💡 Include country code (e.g., +1 for US, +234 for Nigeria)
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                    <MessageSquare className="w-4 h-4 inline mr-2" />
                    Pre-filled Message *
                  </label>
                  <textarea
                    value={currentTemplate.message}
                    onChange={(e) => setCurrentTemplate({...currentTemplate, message: e.target.value})}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent h-24 sm:h-32 resize-none transition-all bg-gray-50 focus:bg-white text-sm sm:text-base text-gray-700"
                    placeholder="Hi! I'm interested in your products. Can you please send me your catalog?"
                    required
                  />
                  <p className="text-xs sm:text-sm text-gray-500 mt-2 bg-blue-50 p-2 rounded-lg">
                    💬 This message will appear in the customer&apos;s WhatsApp chat
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => setShowPreview(!showPreview)}
                    className="px-4 sm:px-6 py-2 sm:py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all duration-200 flex items-center justify-center shadow-md hover:shadow-lg text-sm sm:text-base"
                  >
                    <Eye className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    {showPreview ? 'Hide Preview' : 'Show Preview'}
                  </button>

                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="px-6 sm:px-8 py-2 sm:py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-200 flex items-center justify-center shadow-md hover:shadow-lg font-semibold text-sm sm:text-base"
                  >
                    <Link2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    {isEditing ? 'Update Template' : 'Generate Link'}
                  </button>

                  {isEditing && (
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-4 sm:px-6 py-2 sm:py-3 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-all duration-200 shadow-md hover:shadow-lg text-sm sm:text-base"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>

              <div className="lg:pl-8">
                {showPreview && currentTemplate.message && (
                  <MessagePreview 
                    message={currentTemplate.message} 
                    businessName={currentTemplate.businessName || 'Your Business Name'}
                  />
                )}
              </div>
            </div>
          </div>
        )}

        {/* Manage Templates Tab */}
        {activeTab === 'manage' && (
          <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center mb-4 sm:mb-0">
                <div className="bg-emerald-100 rounded-xl p-3 mb-4 sm:mb-0 sm:mr-4 self-start">
                  <Eye className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-600" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800">
                    Your Templates
                  </h2>
                  <p className="text-gray-600 mt-1 text-sm sm:text-base">
                    Manage and track your WhatsApp link templates
                  </p>
                </div>
              </div>
              {templates.length > 0 && (
                <div className="text-center sm:text-right">
                  <div className="text-xl sm:text-2xl font-bold text-gray-800">{templates.length}</div>
                  <div className="text-xs sm:text-sm text-gray-500">Total Templates</div>
                </div>
              )}
            </div>

            {templates.length === 0 ? (
              <div className="text-center py-12 sm:py-16">
                <div className="bg-gray-100 rounded-full w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <MessageSquare className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-gray-400" />
                </div>
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">No templates yet</h3>
                <p className="text-gray-500 text-sm sm:text-base lg:text-lg mb-6 sm:mb-8 max-w-md mx-auto px-4 sm:px-0">
                  Create your first WhatsApp link template to get started with streamlined customer communication.
                </p>
                <button
                  onClick={() => setActiveTab('create')}
                  className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold text-sm sm:text-base"
                >
                  <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2 inline" />
                  Create Your First Template
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
                {templates.map((template) => (
                  <div key={template.id} className="border border-gray-200 rounded-xl p-4 sm:p-6 hover:border-green-300 transition-all duration-200 hover:shadow-md bg-gradient-to-br from-white to-gray-50">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-lg sm:text-xl text-gray-800 mb-1 truncate">
                          {template.businessName}
                        </h3>
                        <p className="text-gray-600 flex items-center text-sm sm:text-base">
                          <Phone className="w-4 h-4 mr-1 flex-shrink-0" />
                          <span className="truncate">{template.phoneNumber}</span>
                        </p>
                      </div>
                      <div className="flex space-x-2 ml-4">
                        <button
                          onClick={() => editTemplate(template)}
                          className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-all duration-200"
                          title="Edit Template"
                        >
                          <Edit3 className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                        <button
                          onClick={() => deleteTemplate(template.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200"
                          title="Delete Template"
                        >
                          <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-3 sm:p-4 mb-4 border-l-4 border-green-400">
                      <p className="text-gray-700 italic text-sm sm:text-base line-clamp-3">
                        `&quot;{template.message}`&quot;
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs sm:text-sm text-gray-600 mb-4 space-y-2 sm:space-y-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs truncate max-w-32 sm:max-w-none">
                          {template.shortUrl}
                        </span>
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                          {template.clicks} clicks
                        </span>
                      </div>
                      <span className="text-gray-500 text-xs">
                        {new Date(template.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                      <button
                        onClick={() => handleShortUrlClick(template)}
                        className="flex-1 px-3 sm:px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all duration-200 flex items-center justify-center font-medium text-sm sm:text-base"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Open Link
                      </button>
                      
                      <button
                        onClick={() => copyToClipboard(template.shortUrl)}
                        className={`flex-1 px-3 sm:px-4 py-2 rounded-lg transition-all duration-200 flex items-center justify-center font-medium text-sm sm:text-base ${
                          copiedUrl === template.shortUrl
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        {copiedUrl === template.shortUrl ? 'Copied!' : 'Copy URL'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        {/* Footer */}
        {/* Footer */}
        <footer className="text-center py-6 sm:py-8 text-gray-500">
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm">
            <p className="font-medium text-sm sm:text-base">© {new Date().getFullYear()} WhatsApp Link Generator</p>
            <p className="text-xs sm:text-sm mt-1">Streamline your business communication with professional WhatsApp links</p>
            <p className="text-xs sm:text-sm mt-2 text-gray-400">Built by Dabs with ❤️</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default WhatsAppLinkGenerator;