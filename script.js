document.addEventListener('DOMContentLoaded', () => {
    console.log('ConnectSphere: Unleashed!');

    const postFeed = document.getElementById('postFeed');
    const darkModeToggle = document.getElementById('darkModeToggle');
    const fabButton = document.querySelector('.fab');
    const profileName = document.getElementById('profileName');
    const profileBio = document.getElementById('profileBio');
    const followersCount = document.getElementById('followersCount');
    const followingCount = document.getElementById('followingCount');
    const postsCount = document.getElementById('postsCount');
    const followButton = document.querySelector('.follow-button');
    const bottomNavItems = document.querySelectorAll('.bottom-nav .nav-item');

    // --- Mock Data for Dynamic Posts ---
    const postsData = [
        {
            id: 'post1',
            user: {
                name: 'Aisha Khan',
                avatar: 'https://source.unsplash.com/random/50x50/?woman,face,model',
                handle: '@aishak'
            },
            timestamp: '5 minutes ago',
            content: 'Exploring the breathtaking landscapes of Nigeria! Every corner holds a new adventure. ✨ #travel #nigeria #adventure #nature',
            image: 'https://source.unsplash.com/random/600x450/?nigeria-landscape,natural-park',
            likes: 25,
            comments: 5,
            isLiked: false
        },
        {
            id: 'post2',
            user: {
                name: 'Chinedu Okoro',
                avatar: 'https://source.unsplash.com/random/50x50/?man,face,developer',
                handle: '@chinedu_dev'
            },
            timestamp: '30 minutes ago',
            content: 'Just finished reading an amazing article about the vibrant tech scene in Lagos. So much innovation happening! Excited for the future. 🚀 #tech #lagos #innovation #startup',
            image: null, // No image for this post
            likes: 18,
            comments: 2,
            isLiked: true
        },
        {
            id: 'post3',
            user: {
                name: 'Amara Eze',
                avatar: 'https://source.unsplash.com/random/50x50/?chef,woman,foodie',
                handle: '@amara_cooks'
            },
            timestamp: '1 hour ago',
            content: 'Nothing beats a warm plate of homemade jollof rice and plantain! Comfort food at its finest. 😋 What\'s your favorite Nigerian dish? #foodie #nigerianfood #jollofrice #comfortfood',
            image: 'https://source.unsplash.com/random/600x450/?jollof-rice,nigerian-food',
            likes: 32,
            comments: 8,
            isLiked: false
        },
        {
            id: 'post4',
            user: {
                name: 'Biodun Adekunle',
                avatar: 'https://source.unsplash.com/random/50x50/?artist,man,creative',
                handle: '@biodun_art'
            },
            timestamp: '2 hours ago',
            content: 'New art piece in progress! Playing with abstract forms and bold colors. What do you think? #art #abstractart #creative #painting',
            image: 'https://source.unsplash.com/random/600x450/?abstract-painting,art-studio',
            likes: 45,
            comments: 12,
            isLiked: false
        },
        {
            id: 'post5',
            user: {
                name: 'Fatima Umar',
                avatar: 'https://source.unsplash.com/random/50x50/?doctor,woman,science',
                handle: '@dr_fatima'
            },
            timestamp: 'Yesterday',
            content: 'A busy day at the clinic, but always rewarding to help others. Remember to prioritize your health! #health #wellness #medicine #doctor',
            image: null,
            likes: 28,
            comments: 3,
            isLiked: true
        }
    ];

    // --- Dynamic Post Rendering Function ---
    function renderPosts() {
        postFeed.innerHTML = ''; // Clear loading spinner/previous posts
        postsData.forEach(post => {
            const postElement = document.createElement('div');
            postElement.classList.add('post');
            postElement.setAttribute('data-post-id', post.id);

            const postImageHtml = post.image ? `<img src="${post.image}" alt="Post Image">` : '';
            const likeClass = post.isLiked ? 'liked' : '';
            const likeIcon = post.isLiked ? '<i class="fas fa-heart"></i>' : '<i class="far fa-heart"></i>'; // fas for filled, far for regular

            postElement.innerHTML = `
                <div class="post-header">
                    <img src="${post.user.avatar}" alt="${post.user.name} Avatar" class="avatar">
                    <div class="user-info">
                        <strong>${post.user.name}</strong>
                        <span>${post.user.handle} • ${post.timestamp}</span>
                    </div>
                </div>
                <div class="post-content">
                    ${postImageHtml}
                    <p>${post.content}</p>
                    <div class="post-actions">
                        <button class="like-button ${likeClass}">
                            ${likeIcon} <span>${post.likes}</span>
                        </button>
                        <button class="comment-button">
                            <i class="far fa-comment"></i> <span>${post.comments}</span>
                        </button>
                        <button class="share-button">
                            <i class="fas fa-share-alt"></i> Share
                        </button>
                    </div>
                </div>
            `;
            postFeed.appendChild(postElement);
        });
    }

    // --- Initialize Posts ---
    renderPosts();

    // --- Event Delegation for Post Actions (Handles dynamically added posts) ---
    postFeed.addEventListener('click', (event) => {
        const targetButton = event.target.closest('button');
        if (!targetButton) return; // Not a button click

        const postElement = targetButton.closest('.post');
        if (!postElement) return; // Button not inside a post

        const postId = postElement.getAttribute('data-post-id');
        const post = postsData.find(p => p.id === postId);

        if (targetButton.classList.contains('like-button')) {
            const icon = targetButton.querySelector('i');
            const likesSpan = targetButton.querySelector('span');

            if (post.isLiked) {
                post.likes--;
                icon.classList.remove('fas');
                icon.classList.add('far');
                targetButton.classList.remove('liked');
            } else {
                post.likes++;
                icon.classList.remove('far');
                icon.classList.add('fas');
                targetButton.classList.add('liked');
            }
            post.isLiked = !post.isLiked;
            likesSpan.textContent = post.likes;
            console.log(`Post ${postId} liked status: ${post.isLiked}, Likes: ${post.likes}`);
        } else if (targetButton.classList.contains('comment-button')) {
            alert(`Commenting on post by ${post.user.name}... (A comment modal would open here!)`);
            console.log(`Comment button clicked for post ${postId}`);
        } else if (targetButton.classList.contains('share-button')) {
            alert(`Sharing post by ${post.user.name}! (Share sheet with options would appear)`);
            console.log(`Share button clicked for post ${postId}`);
        }
    });

    // --- Dark Mode Toggle ---
    const currentTheme = localStorage.getItem('theme') || 'dark-mode';
    document.body.classList.add(currentTheme);
    darkModeToggle.querySelector('i').className = currentTheme === 'dark-mode' ? 'fas fa-moon' : 'fas fa-sun';

    darkModeToggle.addEventListener('click', () => {
        if (document.body.classList.contains('dark-mode')) {
            document.body.classList.remove('dark-mode');
            document.body.classList.add('light-mode');
            darkModeToggle.querySelector('i').className = 'fas fa-sun';
            localStorage.setItem('theme', 'light-mode');
        } else {
            document.body.classList.remove('light-mode');
            document.body.classList.add('dark-mode');
            darkModeToggle.querySelector('i').className = 'fas fa-moon';
            localStorage.setItem('theme', 'dark-mode');
        }
        console.log('Dark mode toggled!');
    });

    // --- Floating Action Button (FAB) for New Post ---
    fabButton.addEventListener('click', () => {
        alert('Ready to create a new post! (This would open a compose screen)');
        console.log('FAB clicked - new post initiated.');
    });

    // --- Profile Preview Data (Simulated) ---
    // In a real app, this would come from an API
    const userProfile = {
        name: 'Chioma Nkechi',
        bio: 'Tech enthusiast, aspiring entrepreneur, and lover of vibrant cultures. Building connections, one line of code at a time. 🇳🇬',
        followers: 1250,
        following: 870,
        posts: 112
    };

    profileName.textContent = userProfile.name;
    profileBio.textContent = userProfile.bio;
    followersCount.textContent = userProfile.followers;
    followingCount.textContent = userProfile.following;
    postsCount.textContent = userProfile.posts;

    // --- Follow Button Toggle ---
    let isFollowing = false; // Initial state
    followButton.addEventListener('click', () => {
        isFollowing = !isFollowing;
        const icon = followButton.querySelector('i');
        const textNode = followButton.childNodes[1]; // Get the text node ' Follow' or ' Following'

        if (isFollowing) {
            followButton.classList.add('following');
            icon.className = 'fas fa-user-check';
            textNode.textContent = ' Following';
            followersCount.textContent = parseInt(followersCount.textContent) + 1; // Simulate follower increase
            console.log('User followed!');
        } else {
            followButton.classList.remove('following');
            icon.className = 'fas fa-user-plus';
            textNode.textContent = ' Follow';
            followersCount.textContent = parseInt(followersCount.textContent) - 1; // Simulate follower decrease
            console.log('User unfollowed!');
        }
    });

    // --- Bottom Navigation Active State ---
    bottomNavItems.forEach(item => {
        item.addEventListener('click', (event) => {
            event.preventDefault(); // Prevent default link behavior
            bottomNavItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
            const navSection = item.getAttribute('data-nav');
            console.log(`Navigating to: ${navSection}`);
            // In a real app, this would load content for the selected section
            alert(`Navigating to ${navSection} section!`);
        });
    });

    // --- View Full Profile Button ---
    const viewProfileBtn = document.querySelector('.view-profile-btn');
    if (viewProfileBtn) {
        viewProfileBtn.addEventListener('click', () => {
            alert('Loading your full profile page... (More details and specific user posts would be here!)');
            console.log('View Full Profile button clicked.');
        });
    }

    // --- Simulate Page Scroll (for sticky elements check) ---
    window.addEventListener('scroll', () => {
        // This is where you might add effects based on scroll position,
        // e.g., shrinking header or showing/hiding FAB
    });
});
