// DOM Elements
const createBtn = document.getElementById('create-notification');
const titleInput = document.getElementById('notification-title');
const messageInput = document.getElementById('notification-message');
const typeSelect = document.getElementById('notification-type');
const positionSelect = document.getElementById('notification-position');
const durationInput = document.getElementById('notification-duration');
const soundCheckbox = document.getElementById('notification-sound');
const vibrationCheckbox = document.getElementById('notification-vibration');
const previewNotification = document.getElementById('preview-notification');
const notificationsContainer = document.getElementById('notifications-container');

// Sound effects
const sounds = {
    info: new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3'),
    success: new Audio('https://assets.mixkit.co/active_storage/sfx/1434/1434-preview.mp3'),
    warning: new Audio('https://assets.mixkit.co/active_storage/sfx/2868/2868-preview.mp3'),
    error: new Audio('https://assets.mixkit.co/active_storage/sfx/2867/2867-preview.mp3')
};

// Icon mapping
const icons = {
    info: 'fa-info-circle',
    success: 'fa-check-circle',
    warning: 'fa-exclamation-triangle',
    error: 'fa-times-circle'
};

// Color mapping
const colors = {
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FFC107',
    error: '#F44336'
};

// Update preview when inputs change
[titleInput, messageInput, typeSelect].forEach(input => {
    input.addEventListener('input', updatePreview);
});

function updatePreview() {
    const title = titleInput.value || 'Sample Title';
    const message = messageInput.value || 'This is a sample notification message.';
    const type = typeSelect.value;
    
    previewNotification.className = `preview-notification ${type}`;
    previewNotification.querySelector('.notification-icon i').className = `fas ${icons[type]}`;
    previewNotification.querySelector('.notification-icon').style.color = colors[type];
    previewNotification.querySelector('.notification-content h3').textContent = title;
    previewNotification.querySelector('.notification-content p').textContent = message;
}

// Create notification
createBtn.addEventListener('click', () => {
    const title = titleInput.value.trim();
    const message = messageInput.value.trim();
    const type = typeSelect.value;
    const position = positionSelect.value;
    const duration = parseInt(durationInput.value);
    
    if (!title || !message) {
        showNotification('Error', 'Please fill in both title and message fields.', 'error');
        return;
    }
    
    createNotification(title, message, type, position, duration);
});

function createNotification(title, message, type, position, duration) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    // Set position
    notificationsContainer.style.position = 'fixed';
    switch (position) {
        case 'top-right':
            notificationsContainer.style.top = '20px';
            notificationsContainer.style.right = '20px';
            break;
        case 'top-left':
            notificationsContainer.style.top = '20px';
            notificationsContainer.style.left = '20px';
            break;
        case 'bottom-right':
            notificationsContainer.style.bottom = '20px';
            notificationsContainer.style.right = '20px';
            break;
        case 'bottom-left':
            notificationsContainer.style.bottom = '20px';
            notificationsContainer.style.left = '20px';
            break;
    }
    
    // Create notification content
    notification.innerHTML = `
        <div class="notification-icon">
            <i class="fas ${icons[type]}"></i>
        </div>
        <div class="notification-content">
            <h3>${title}</h3>
            <p>${message}</p>
        </div>
        <button class="close-btn">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add to container
    notificationsContainer.appendChild(notification);
    
    // Play sound if enabled
    if (soundCheckbox.checked) {
        sounds[type].play().catch(() => {
            console.log('Sound playback failed');
        });
    }
    
    // Vibrate if enabled
    if (vibrationCheckbox.checked && 'vibrate' in navigator) {
        navigator.vibrate(200);
    }
    
    // Add close button functionality
    const closeBtn = notification.querySelector('.close-btn');
    closeBtn.addEventListener('click', () => {
        removeNotification(notification);
    });
    
    // Auto remove after duration
    if (duration > 0) {
        setTimeout(() => {
            removeNotification(notification);
        }, duration * 1000);
    }
}

function removeNotification(notification) {
    notification.style.animation = 'slideOut 0.3s ease forwards';
    setTimeout(() => {
        notification.remove();
    }, 300);
}

// Show error notification
function showNotification(title, message, type) {
    createNotification(title, message, type, 'top-right', 5);
}

// Initialize preview
updatePreview();

// Add keyboard shortcut (Ctrl/Cmd + Enter to create notification)
document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        createBtn.click();
    }
}); 