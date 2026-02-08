// Event Proposal Assistant - Main JavaScript File

class EventProposalAssistant {
    constructor() {
        // Initialize DOM elements
        this.chatMessages = document.getElementById('chatMessages');
        this.messageInput = document.getElementById('messageInput');
        this.sendButton = document.getElementById('sendButton');
        this.micButton = document.getElementById('micButton');
        this.recordingIndicator = document.getElementById('recordingIndicator');
        this.loadingOverlay = document.getElementById('loadingOverlay');
        this.charCount = document.getElementById('charCount');
        
        // Speech Recognition setup
        this.recognition = null;
        this.isRecording = false;
        this.setupSpeechRecognition();
        
        // Initialize event listeners
        this.initializeEventListeners();
        
        // Sample responses for demo
        this.responses = [
            "Generating event proposal based on your input...",
            "I'll help you create a professional event proposal. Let me process the details you've provided...",
            "Thank you for the information. I'm now creating a customized event proposal that includes all your requirements...",
            "Based on your event description, I'm generating a comprehensive proposal with budget estimates, timeline, and logistics...",
            "Processing your event details to create a professional proposal with venue recommendations and scheduling options..."
        ];
    }

    // Initialize all event listeners
    initializeEventListeners() {
        // Send button click
        this.sendButton.addEventListener('click', () => this.sendMessage());
        
        // Enter key to send message (Shift+Enter for new line)
        this.messageInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
        
        // Auto-resize textarea
        this.messageInput.addEventListener('input', () => {
            this.autoResizeTextarea();
            this.updateCharCount();
        });
        
        // Microphone button
        this.micButton.addEventListener('click', () => {
            if (this.isRecording) {
                this.stopRecording();
            } else {
                this.startRecording();
            }
        });
        
        // Initial character count
        this.updateCharCount();
    }

    // Setup Web Speech API
    setupSpeechRecognition() {
        // Check browser compatibility
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            console.warn('Speech Recognition not supported in this browser');
            this.micButton.style.display = 'none';
            return;
        }

        // Initialize Speech Recognition
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        this.recognition = new SpeechRecognition();
        
        // Configure recognition settings - Manual control with continuous listening
        this.recognition.continuous = true;
        this.recognition.interimResults = false;
        this.recognition.lang = 'en-US';
        
        // Handle speech recognition results
        this.recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            this.messageInput.value += (this.messageInput.value ? ' ' : '') + transcript;
            this.autoResizeTextarea();
            this.updateCharCount();
            this.messageInput.focus();
        };
        
        // Handle recognition end - Only stop if manually stopped
        this.recognition.onend = () => {
            // Only reset UI if we're not manually recording
            if (!this.isRecording) {
                this.resetMicrophoneUI();
            }
        };
        
        // Handle recognition errors
        this.recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            this.stopRecording();
            this.showTemporaryMessage('Speech recognition error. Please try again.');
        };
    }

    // Start voice recording - Manual control only
    startRecording() {
        if (!this.recognition) {
            this.showTemporaryMessage('Speech recognition not supported in this browser.');
            return;
        }

        try {
            this.isRecording = true;
            this.micButton.classList.add('recording');
            this.recordingIndicator.classList.remove('hidden');
            
            // Update mic button icon to show recording state
            this.micButton.innerHTML = '<i class="fas fa-stop"></i>';
            this.micButton.title = 'Stop Recording';
            
            this.recognition.start();
            
            // No automatic timeout - fully manual control
            
        } catch (error) {
            console.error('Error starting speech recognition:', error);
            this.resetMicrophoneUI();
            this.showTemporaryMessage('Could not start voice recording. Please try again.');
        }
    }

    // Stop voice recording - Manual control
    stopRecording() {
        if (this.recognition && this.isRecording) {
            this.recognition.stop();
        }
        
        this.isRecording = false;
        this.resetMicrophoneUI();
    }

    // Reset microphone UI to default state
    resetMicrophoneUI() {
        this.micButton.classList.remove('recording');
        this.recordingIndicator.classList.add('hidden');
        this.micButton.innerHTML = '<i class="fas fa-microphone"></i>';
        this.micButton.title = 'Voice Input';
    }

    // Auto-resize textarea based on content
    autoResizeTextarea() {
        this.messageInput.style.height = 'auto';
        this.messageInput.style.height = Math.min(this.messageInput.scrollHeight, 120) + 'px';
        
        // Enable/disable send button based on input
        this.sendButton.disabled = this.messageInput.value.trim().length === 0;
    }

    // Update character count
    updateCharCount() {
        const count = this.messageInput.value.length;
        this.charCount.textContent = count;
        
        // Change color based on character limit - Updated for dark theme
        if (count > 900) {
            this.charCount.style.color = '#ff6b6b';
        } else if (count > 800) {
            this.charCount.style.color = '#ffd43b';
        } else {
            this.charCount.style.color = '#888888';
        }
    }

    // Send message function
    sendMessage() {
        const message = this.messageInput.value.trim();
        
        if (!message) return;
        
        // Add user message to chat
        this.addMessage(message, 'user');
        
        // Clear input
        this.messageInput.value = '';
        this.autoResizeTextarea();
        this.updateCharCount();
        
        // Simulate system response
        this.simulateSystemResponse();
    }

    // Add message to chat area
    addMessage(text, sender = 'system') {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        const currentTime = new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
        });
        
        const avatar = sender === 'user' ? 
            '<i class="fas fa-user"></i>' : 
            '<i class="fas fa-robot"></i>';
        
        messageDiv.innerHTML = `
            <div class="message-avatar">
                ${avatar}
            </div>
            <div class="message-content">
                <div class="message-text">${this.escapeHtml(text)}</div>
                <div class="message-time">${currentTime}</div>
            </div>
        `;
        
        this.chatMessages.appendChild(messageDiv);
        this.scrollToBottom();
    }

    // Simulate system response with typing effect
    simulateSystemResponse() {
        // Show typing indicator
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message system-message typing-indicator';
        typingDiv.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-robot"></i>
            </div>
            <div class="message-content">
                <div class="message-text">
                    <div class="typing-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
            </div>
        `;
        
        // Add typing animation CSS - Updated for dark theme
        const typingStyle = document.createElement('style');
        typingStyle.textContent = `
            .typing-dots {
                display: flex;
                gap: 4px;
                align-items: center;
                padding: 8px 0;
            }
            .typing-dots span {
                width: 8px;
                height: 8px;
                background: #cccccc;
                border-radius: 50%;
                animation: typing 1.4s infinite;
            }
            .typing-dots span:nth-child(2) {
                animation-delay: 0.2s;
            }
            .typing-dots span:nth-child(3) {
                animation-delay: 0.4s;
            }
            @keyframes typing {
                0%, 60%, 100% {
                    transform: translateY(0);
                    opacity: 0.5;
                }
                30% {
                    transform: translateY(-10px);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(typingStyle);
        
        this.chatMessages.appendChild(typingDiv);
        this.scrollToBottom();
        
        // Remove typing indicator and add actual response after delay
        setTimeout(() => {
            typingDiv.remove();
            const randomResponse = this.responses[Math.floor(Math.random() * this.responses.length)];
            this.addMessage(randomResponse);
            
            // Add follow-up message for event proposal generation
            setTimeout(() => {
                const followUp = this.generateEventProposalResponse();
                this.addMessage(followUp);
            }, 2000);
            
        }, 1500 + Math.random() * 1000); // Random delay 1.5-2.5s
    }

    // Generate a sample event proposal response
    generateEventProposalResponse() {
        const proposals = [
            `📋 **Event Proposal Generated Successfully!**

Here's your customized event proposal:

**Event Overview:**
• Professional planning with detailed timeline
• Budget breakdown with cost-effective options  
• Venue recommendations based on your requirements
• Catering and logistics coordination

**Next Steps:**
1. Review the detailed proposal document
2. Select preferred venue and catering options
3. Confirm final guest count and special requirements
4. Schedule follow-up planning meeting

Would you like me to modify any aspects of this proposal or add additional details?`,

            `✨ **Your Event Proposal is Ready!**

I've created a comprehensive proposal that includes:

**Key Features:**
• Complete event timeline and checklist
• Vendor recommendations with contact details
• Risk management and contingency planning
• Post-event evaluation framework

**Included Services:**
• Event coordination and management
• Marketing and promotion support
• On-site coordination team
• Technical equipment and setup

Please let me know if you'd like to adjust the scope, budget, or any specific requirements!`,

            `🎉 **Event Proposal Completed Successfully!**

Your customized event proposal covers:

**Planning Highlights:**
• Detailed project timeline with milestones
• Comprehensive budget with payment schedule
• Venue setup and layout recommendations
• Entertainment and speaker coordination

**Additional Services:**
• Registration and guest management
• Photography and videography options
• Catering menu with dietary accommodations
• Transportation and parking solutions

Ready to move forward with your event planning? I can help refine any details!`
        ];
        
        return proposals[Math.floor(Math.random() * proposals.length)];
    }

    // Scroll chat to bottom
    scrollToBottom() {
        setTimeout(() => {
            this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
        }, 100);
    }

    // Show temporary message (for errors, etc.)
    showTemporaryMessage(text) {
        const notification = document.createElement('div');
        notification.className = 'temporary-notification';
        notification.textContent = text;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #ef4444;
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            font-size: 14px;
            z-index: 1001;
            animation: slideInRight 0.3s ease-out;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-in forwards';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Escape HTML to prevent XSS
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new EventProposalAssistant();
});

// Add CSS animations for notifications
const animationStyles = document.createElement('style');
animationStyles.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(animationStyles);

// Service Worker Registration (Optional - for offline functionality)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}