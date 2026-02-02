/**
 * Email functionality for sending the date plan
 */

/**
 * Send an email with the date plan summary
 * @param {Object} summary - The summary data to include in the email
 * @returns {Promise<boolean>} - Whether the email was sent successfully
 */
async function sendEmail(summary) {
  try {
    console.log('sendEmail called with summary:', summary);
    
    if (!CONFIG.email || !CONFIG.email.enabled) {
      console.log('Email not enabled in config');
      return false;
    }

    // Ensure we have the necessary data
    const summaryData = summary || {
      noClickCount: Navigation.getData().noClickCount || 0,
      acceptedAt: Navigation.getData().acceptedAt ? new Date(Navigation.getData().acceptedAt) : null,
      date: Navigation.getData().selectedDate,
      formattedDate: Navigation.getData().selectedDate ? Utils.formatDate(Navigation.getData().selectedDate) : 'Not selected',
      food: Navigation.getData().selectedFood || [],
      dessert: Navigation.getData().selectedDessert || [],
      activities: Navigation.getData().selectedActivities || [],
      countdown: Navigation.getData().selectedDate ? Utils.getTimeRemaining(Navigation.getData().selectedDate) : null
    };
    
    console.log('Using summary data:', summaryData);

    const details = {
      summary: {
        formattedDate: summaryData.formattedDate || 'Saturday, February 14, 2026',
        noClickCount: summaryData.noClickCount || 0,
        acceptedAt: summaryData.acceptedAt || new Date()
      },
      foodLabels: mapIdsToLabels(summaryData.food || [], CONFIG.foodOptions || []),
      dessertLabels: mapIdsToLabels(summaryData.dessert || [], CONFIG.dessertOptions || []),
      activityLabels: mapIdsToLabels(summaryData.activities || [], CONFIG.activityOptions || [])
    };

    const { summary: summaryInfo, foodLabels, dessertLabels, activityLabels } = details;
    console.log('Preparing email with details:', details);

    const lines = [
      'Hi Nitin! 💌',
      "Here's the Valentine date plan straight from your website:",
      '',
      `📅 Date: ${summaryInfo.formattedDate}`,
      `😄 Chase Count: ${summaryInfo.noClickCount}`,
      `🍽️ Food: ${formatSelectionList(foodLabels)}`,
      `🍰 Dessert: ${formatSelectionList(dessertLabels)}`,
      `🎯 Activities: ${formatSelectionList(activityLabels)}`,
      '',
      `Final Message: ${CONFIG.finalMessage || '❤️'}`,
      '',
      'Sent with 💖 from your Valentine experience.'
    ];

    const payload = {
      _subject: CONFIG.email.subject || 'Your Valentine Date Plan',
      message: lines.join('\n'),
      date: summaryInfo.formattedDate,
      no_clicks: summaryInfo.noClickCount,
      _captcha: 'false'
    };

    let endpoint = '';
    console.log('Using email provider:', CONFIG.email.provider);

    if (CONFIG.email.provider === 'formspree' && CONFIG.email.formspreeId) {
      endpoint = `https://formspree.io/f/${CONFIG.email.formspreeId}`;
      payload.email = CONFIG.email.recipient || '';
      console.log('Using Formspree endpoint:', endpoint);
    } else if (CONFIG.email.recipient) {
      endpoint = `https://formsubmit.co/ajax/${encodeURIComponent(CONFIG.email.recipient)}`;
      console.log('Using FormSubmit endpoint:', endpoint);
    } else {
      console.error('No valid email configuration found');
      return false;
    }

    console.log('Sending email with payload:', payload);
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    console.log('Email send response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Email send failed:', response.status, errorText);
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const result = await response.json();
    console.log('Email send successful:', result);
    return true;
    
  } catch (error) {
    console.error('Error in sendEmail:', error);
    throw error; // Re-throw to be caught by the caller
  }
}

/**
 * Map IDs to their corresponding labels
 * @param {Array} ids - Array of option IDs
 * @param {Array} options - Array of option objects with id and label properties
 * @returns {Array} - Array of labels
 */
function mapIdsToLabels(ids, options) {
  if (!ids || !options) return [];
  return ids.map(id => {
    const option = options.find(opt => opt.id === id);
    return option ? option.label : id;
  });
}

/**
 * Format an array of items as a comma-separated string
 * @param {Array} items - Array of items to format
 * @returns {string} - Formatted string
 */
function formatSelectionList(items) {
  if (!items || items.length === 0) return 'None selected';
  return items.join(', ');
}
