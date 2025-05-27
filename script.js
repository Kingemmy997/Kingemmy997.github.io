document.addEventListener('DOMContentLoaded', () => {
    console.log('ConnectSphere script loaded!');

    // --- Like/Heart Button Functionality ---
    document.querySelectorAll('.post-actions button:first-child').forEach(button => {
        button.addEventListener('click', () => {
            const icon = button.querySelector('.icon');
            const currentLikesElement = button.childNodes[2]; // Gets the text node directly
            let currentLikes = parseInt(currentLikesElement.textContent.trim());

            if (icon.textContent.includes('❤️')) { // If it's a filled heart, means it's liked
                icon.textContent = '🤍'; // Change to empty heart
                currentLikes--;
                button.classList.remove('liked'); // Remove 'liked' class
            } else if (icon.textContent.includes('🤍')) { // If it's an empty heart, means it's not liked
                icon.textContent = '❤️'; // Change to filled heart
                currentLikes++;
                button.classList.add('liked'); // Add 'liked' class
            } else if (icon.textContent.includes('👍')) { // For the thumbs up icon
                icon.textContent = '👍'; // Keep thumbs up
                button.classList.toggle('liked'); // Toggle liked state
                if (button.classList.contains('liked')) {
                    currentLikes++;
                } else {
                    currentLikes--;
                }
            } else if (icon.textContent.includes('😍')) { // For the '😍' icon
                 icon.textContent = '🤩'; // Change to another emoji for 'liked'
                 currentLikes++;
                 button.classList.add('liked');
            } else if (icon.textContent.includes('🤩')) {
                 icon.textContent = '😍';
                 currentLikes--;
                 button.classList.remove('liked');
            }

            currentLikesElement.textContent = ` ${currentLikes}`; // Update the number of likes
        });
    });

    // --- Comment Button Functionality (Placeholder) ---
    document.querySelectorAll('.post-actions button:nth-child(2)').forEach(button => {
        button.addEventListener('click', () => {
            alert('Opening comments... (This would navigate to a detailed post view or show a comment modal)');
            // In a real app, this would likely:
            // 1. Navigate to a post-detail page.
            // 2. Open a modal for comments.
        });
    });

    // --- Share Button Functionality (Placeholder) ---
    document.querySelectorAll('.post-actions button:nth-child(3)').forEach(button => {
        button.addEventListener('click', () => {
            alert('Sharing post... (This would open a share sheet)');
            // In a real app, this would integrate with native share APIs or a custom share modal.
        });
    });

    // --- View Full Profile Button ---
    const viewProfileBtn = document.querySelector('.view-profile-btn');
    if (viewProfileBtn) {
        viewProfileBtn.addEventListener('click', () => {
            alert('Navigating to full profile! (This would load your full profile page)');
            // In a real app, this would redirect the user to their full profile page.
        });
    }

    // You can add more dynamic features here, like:
    // - Infinite scroll for feed
    // - Posting new content (requires backend)
    // - Real-time notifications (requires backend and WebSockets)
    // - User authentication (requires backend)
});
