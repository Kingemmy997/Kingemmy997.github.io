document.addEventListener('DOMContentLoaded', () => {
    console.log('ConnectSphere: Unleashed - Master Script Loaded!');

    // --- DOM Elements ---
    const appContent = document.getElementById('appContent'); // Main content area for SPA
    const darkModeToggle = document.getElementById('darkModeToggle');
    const fabButton = document.querySelector('.fab');
    const bottomNavItems = document.querySelectorAll('.bottom-nav .nav-item');

    // Elements specific to messages.html (conditional existence)
    const conversationList = document.getElementById('conversationList');
    const chatWindow = document.getElementById('chatWindow');
    const backToConversationsBtn = document.getElementById('backToConversations');
    const chatWindowUserName = document.getElementById('chatWindowUserName');
    const chatWindowAvatar = document.getElementById('chatWindowAvatar');
    const chatWindowStatus = document.getElementById('chatWindowStatus');
    const chatMessagesContainer = document.getElementById('chatMessages');
    const messageInput = document.getElementById('messageInput');
    const sendMessageButton = document.getElementById('sendMessageButton');

    // --- Mock Data ---
    // Function to generate random timestamp
    const getRandomTimestamp = () => {
        const now = new Date();
        const randomMinutes = Math.floor(Math.random() * 24 * 60); // Up to 24 hours ago
        now.setMinutes(now.getMinutes() - randomMinutes);
        const diffInMinutes = Math.floor((new Date() - now) / (1000 * 60));
        if (diffInMinutes < 1) return 'Just now';
        if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
        if (diffInMinutes < 24 * 60) return `${Math.floor(diffInMinutes / 60)} hours ago`;
        return `${Math.floor(diffInMinutes / (24 * 60))} days ago`;
    };

    const usersData = [
        { id: 'u1', name: 'Aisha Khan', handle: '@aishak', avatar: 'https://source.unsplash.com/random/50x50/?woman,face,model,african' },
        { id: 'u2', name: 'Chinedu Okoro', handle: '@chinedu_dev', avatar: 'https://source.unsplash.com/random/50x50/?man,face,developer,african' },
        { id: 'u3', name: 'Amara Eze', handle: '@amara_cooks', avatar: 'https://source.unsplash.com/random/50x50/?chef,woman,foodie,african' },
        { id: 'u4', name: 'Biodun Adekunle', handle: '@biodun_art', avatar: 'https://source.unsplash.com/random/50x50/?artist,man,creative,african' },
        { id: 'u5', name: 'Fatima Umar', handle: '@dr_fatima', avatar: 'https://source.unsplash.com/random/50x50/?doctor,woman,science,african' },
        { id: 'u6', name: 'Kwame Mensah', handle: '@kwame_explores', avatar: 'https://source.unsplash.com/random/50x50/?explorer,man,african' },
        { id: 'u7', name: 'Ngozi Adebayo', handle: '@gozi_vlogs', avatar: 'https://source.unsplash.com/random/50x50/?vlogger,woman,african' },
    ];

    const postsData = [
        {
            id: 'p1', user_id: 'u1', type: 'image',
            content: 'Exploring the breathtaking landscapes of Nigeria! Every corner holds a new adventure. ✨ #travel #nigeria #adventure #nature',
            media: 'https://source.unsplash.com/random/600x450/?nigeria-landscape,natural-park,scenic',
            likes: 25, comments: 5, isLiked: false, timestamp: getRandomTimestamp()
        },
        {
            id: 'p2', user_id: 'u2', type: 'text',
            content: 'Just finished reading an amazing article about the vibrant tech scene in Lagos. So much innovation happening! Excited for the future. 🚀 #tech #lagos #innovation #startup @aishak',
            media: null, likes: 18, comments: 2, isLiked: true, timestamp: getRandomTimestamp()
        },
        {
            id: 'p3', user_id: 'u3', type: 'image',
            content: 'Nothing beats a warm plate of homemade jollof rice and plantain! Comfort food at its finest. 😋 What\'s your favorite Nigerian dish? #foodie #nigerianfood #jollofrice #comfortfood',
            media: 'https://source.unsplash.com/random/600x450/?jollof-rice,nigerian-food,delicious',
            likes: 32, comments: 8, isLiked: false, timestamp: getRandomTimestamp()
        },
        {
            id: 'p4', user_id: 'u4', type: 'image',
            content: 'New art piece in progress! Playing with abstract forms and bold colors. What do you think? #art #abstractart #creative #painting',
            media: 'https://source.unsplash.com/random/600x450/?abstract-painting,art-studio,vibrant',
            likes: 45, comments: 12, isLiked: false, timestamp: getRandomTimestamp()
        },
        {
            id: 'p5', user_id: 'u5', type: 'text',
            content: 'A busy day at the clinic, but always rewarding to help others. Remember to prioritize your health! #health #wellness #medicine #doctor',
            media: null, likes: 28, comments: 3, isLiked: true, timestamp: getRandomTimestamp()
        },
        {
            id: 'p6', user_id: 'u6', type: 'video', // Simulate video
            content: 'Capturing the raw beauty of the savanna. So grateful for these moments. #wildlife #africa #naturelover #safari',
            media: 'https://www.w3schools.com/html/mov_bbb.mp4', // Example video URL
            likes: 55, comments: 10, isLiked: false, timestamp: getRandomTimestamp()
        },
        {
            id: 'p7', user_id: 'u7', type: 'image',
            content: 'That golden hour glow hitting the city skyline. ✨ Lagos never ceases to amaze. #lagos #cityscape #sunset #urbanlife',
            media: 'https://source.unsplash.com/random/600x450/?lagos-skyline,sunset-city',
            likes: 60, comments: 15, isLiked: false, timestamp: getRandomTimestamp()
        }
    ];

    const storiesData = [
        { id: 's1', user_id: 'u1', avatar: 'https://source.unsplash.com/random/70x70/?face,woman,story', isYours: true },
        { id: 's2', user_id: 'u2', avatar: 'https://source.unsplash.com/random/70x70/?face,man,story' },
        { id: 's3', user_id: 'u3', avatar: 'https://source.unsplash.com/random/70x70/?face,chef,story' },
        { id: 's4', user_id: 'u4', avatar: 'https://source.unsplash.com/random/70x70/?face,artist,story' },
        { id: 's5', user_id: 'u5', avatar: 'https://source.unsplash.com/random/70x70/?face,doctor,story' },
        { id: 's6', user_id: 'u6', avatar: 'https://source.unsplash.com/random/70x70/?face,traveler,story' },
        { id: 's7', user_id: 'u7', avatar: 'https://source.unsplash.com/random/70x70/?face,vlogger,story' },
        { id: 's8', user_id: 'u1', avatar: 'https://source.unsplash.com/random/70x70/?face,african,story', isYours: true }, // Another for "your story"
    ];

    const conversationsData = [
        {
            id: 'conv1', user_id: 'u2', name: 'Chinedu Okoro', avatar: 'https://source.unsplash.com/random/60x60/?man,profile,chat', lastMessage: 'Hey, did you see the new tech article?', time: '2:30 PM', status: 'Online',
            messages: [
                { sender: 'other', text: 'Hey there! How\'s it going?', timestamp: '1:50 PM' },
                { sender: 'self', text: 'Doing great! Just working on the ConnectSphere update. 😎', timestamp: '1:52 PM' },
                { sender: 'other', text: 'Awesome! Heard about any cool new features?', timestamp: '1:55 PM' },
                { sender: 'self', text: 'Yeah, tons! Dynamic content, better dark mode, and a slick chat interface. Still building it out.', timestamp: '1:58 PM' },
                { sender: 'other', text: 'Nice! Can\'t wait to see it. Did you see the new tech article?', timestamp: '2:30 PM' },
            ]
        },
        {
            id: 'conv2', user_id: 'u3', name: 'Amara Eze', avatar: 'https://source.unsplash.com/random/60x60/?woman,chef,chat', lastMessage: 'That jollof recipe you shared was amazing!', time: 'Yesterday', status: 'Offline',
            messages: [
                { sender: 'other', text: 'Hi! That jollof recipe you shared was amazing!', timestamp: 'Yesterday 5:00 PM' },
                { sender: 'self', text: 'Oh, fantastic! So glad you enjoyed it. It\'s a family secret! 😉', timestamp: 'Yesterday 5:05 PM' },
            ]
        },
        {
            id: 'conv3', user_id: 'u6', name: 'Kwame Mensah', avatar: 'https://source.unsplash.com/random/60x60/?explorer,man,chat', lastMessage: 'Thinking of a trip to Obudu Mountain Resort next month.', time: 'Mar 10', status: 'Offline',
            messages: [
                { sender: 'other', text: 'Hey! Thinking of a trip to Obudu Mountain Resort next month. Ever been?', timestamp: 'Mar 10' },
                { sender: 'self', text: 'Not yet, but it\'s on my bucket list! Heard great things about it. Let me know if you need any tips!', timestamp: 'Mar 10' },
            ]
        }
    ];

    // --- Dynamic Content Rendering Functions ---

    // Home Feed Renderer
    function renderHomePage() {
        let homeHtml = `
            <section class="stories-section">
                ${storiesData.map(story => `
                    <div class="story-item ${story.isYours ? 'your-story' : ''}" data-story-id="${story.id}">
                        <img src="${story.avatar}" alt="${usersData.find(u => u.id === story.user_id)?.name || 'User'} Story" class="story-avatar">
                        <span>${story.isYours ? 'Your Story' : (usersData.find(u => u.id === story.user_id)?.name.split(' ')[0] || 'User')}</span>
                    </div>
                `).join('')}
            </section>

            <section class="create-post-section">
                <div class="create-post-header">
                    <img src="${usersData.find(u => u.id === 'u1')?.avatar}" alt="Your Avatar" class="avatar">
                    <input type="text" class="post-input" placeholder="What's on your mind, ${usersData.find(u => u.id === 'u1')?.name.split(' ')[0]}?">
                </div>
                <div class="create-post-actions">
                    <button><i class="fas fa-image"></i> Photo</button>
                    <button><i class="fas fa-video"></i> Video</button>
                    <button><i class="fas fa-calendar-alt"></i> Event</button>
                </div>
            </section>

            <section class="feed">
                </section>
        `;
        appContent.innerHTML = homeHtml;
        renderPosts(); // Populate the feed section
    }

    // Post Renderer (called by renderHomePage)
    function renderPosts() {
        const feedSection = appContent.querySelector('.feed'); // Select the feed section within the loaded content
        if (!feedSection) return; // Ensure element exists

        feedSection.innerHTML = ''; // Clear previous posts
        postsData.forEach(post => {
            const user = usersData.find(u => u.id === post.user_id);
            if (!user) return; // Skip if user not found

            const postElement = document.createElement('div');
            postElement.classList.add('post');
            postElement.setAttribute('data-post-id', post.id);

            let mediaHtml = '';
            if (post.type === 'image' && post.media) {
                mediaHtml = `<img src="${post.media}" alt="Post Image">`;
            } else if (post.type === 'video' && post.media) {
                mediaHtml = `<video controls src="${post.media}" poster="https://picsum.photos/600/400?grayscale&blur=1" style="width:100%; border-radius:12px;"></video>`; // Add a poster
            }

            // Replace #hashtags and @mentions with clickable (non-functional) links
            const formattedContent = post.content
                .replace(/#(\w+)/g, '<a href="#">#$1</a>')
                .replace(/@(\w+)/g, '<a href="#">@$1</a>');

            const likeClass = post.isLiked ? 'liked' : '';
            const likeIcon = post.isLiked ? '<i class="fas fa-heart"></i>' : '<i class="far fa-heart"></i>';

            postElement.innerHTML = `
                <div class="post-header">
                    <img src="${user.avatar}" alt="${user.name} Avatar" class="avatar">
                    <div class="user-info">
                        <strong>${user.name}</strong>
                        <span>${user.handle} • ${post.timestamp}</span>
                    </div>
                </div>
                <div class="post-content">
                    ${mediaHtml}
                    <p>${formattedContent}</p>
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
            feedSection.appendChild(postElement);
        });
    }

    // Explore Page Renderer
    function renderExplorePage() {
        const currentUser = usersData.find(u => u.id === 'u1'); // Assuming u1 is current user

        const trendingTopics = [
            { topic: 'NigeriaTech', count: '1.2M posts' },
            { topic: 'AfrobeatsVibes', count: '870K posts' },
            { topic: 'LagosLife', count: '650K posts' },
            { topic: 'StartupAfrica', count: '420K posts' },
            { topic: 'FoodCultureNG', count: '310K posts' }
        ];

        const suggestedUsers = usersData.filter(u => u.id !== currentUser.id).slice(0, 4); // Get a few others

        appContent.innerHTML = `
            <section class="explore-section">
                <h2>Explore ConnectSphere</h2>
                <div class="trending-topics">
                    <h3><i class="fas fa-fire"></i> Trending Topics</h3>
                    <ul>
                        ${trendingTopics.map(topic => `
                            <li>
                                <a href="#">
                                    <span class="topic-name">#${topic.topic}</span><br>
                                    <span class="topic-count">${topic.count}</span>
                                </a>
                            </li>
                        `).join('')}
                    </ul>
                </div>
                <div class="suggested-users">
                    <h3><i class="fas fa-user-plus"></i> Suggested for You</h3>
                    <ul>
                        ${suggestedUsers.map(user => `
                            <li>
                                <div class="user-item">
                                    <img src="${user.avatar}" alt="${user.name} Avatar" class="avatar">
                                    <div class="user-info">
                                        <span class="user-name">${user.name}</span>
                                        <span class="user-handle">${user.handle}</span>
                                    </div>
                                    <button class="action-button follow-button small-button" data-user-id="${user.id}">
                                        <i class="fas fa-user-plus"></i> Follow
                                    </button>
                                </div>
                            </li>
                        `).join('')}
                    </ul>
                </div>
            </section>
        `;

        // Attach event listeners for follow buttons on explore page
        appContent.querySelectorAll('.explore-section .follow-button').forEach(button => {
            let isFollowing = false; // Local state for each button
            button.addEventListener('click', () => {
                isFollowing = !isFollowing;
                const icon = button.querySelector('i');
                const textNode = button.childNodes[1]; // Get the text node

                if (isFollowing) {
                    button.classList.add('following');
                    icon.className = 'fas fa-user-check';
                    textNode.textContent = ' Following';
                } else {
                    button.classList.remove('following');
                    icon.className = 'fas fa-user-plus';
                    textNode.textContent = ' Follow';
                }
                console.log(`User ${button.dataset.userId} ${isFollowing ? 'followed' : 'unfollowed'} from Explore!`);
            });
        });
    }

    // Notifications Page Renderer
    function renderNotificationsPage() {
        const notificationsData = [
            { id: 'n1', type: 'like', user_id: 'u2', post_id: 'p1', time: '10m ago' },
            { id: 'n2', type: 'comment', user_id: 'u3', post_id: 'p2', comment: 'Great insight!', time: '30m ago' },
            { id: 'n3', type: 'follow', user_id: 'u4', time: '1h ago' },
            { id: 'n4', type: 'mention', user_id: 'u5', post_id: 'p3', time: '2h ago' },
            { id: 'n5', type: 'like', user_id: 'u6', post_id: 'p4', time: '5h ago' },
        ];

        appContent.innerHTML = `
            <section class="notifications-section">
                <h2>Your Notifications</h2>
                <ul>
                    ${notificationsData.map(notif => {
                        const user = usersData.find(u => u.id === notif.user_id);
                        if (!user) return ''; // Skip if user not found

                        let iconHtml = '';
                        let textHtml = '';
                        switch (notif.type) {
                            case 'like':
                                iconHtml = '<i class="fas fa-heart notification-icon"></i>';
                                textHtml = `<strong>${user.name}</strong> liked your post.`;
                                break;
                            case 'comment':
                                iconHtml = '<i class="fas fa-comment notification-icon"></i>';
                                textHtml = `<strong>${user.name}</strong> commented on your post: "${notif.comment}"`;
                                break;
                            case 'follow':
                                iconHtml = '<i class="fas fa-user-plus notification-icon"></i>';
                                textHtml = `<strong>${user.name}</strong> started following you.`;
                                break;
                            case 'mention':
                                iconHtml = '<i class="fas fa-at notification-icon"></i>';
                                textHtml = `<strong>${user.name}</strong> mentioned you in a post.`;
                                break;
                            default:
                                iconHtml = '<i class="fas fa-info-circle notification-icon"></i>';
                                textHtml = `New activity from <strong>${user.name}</strong>.`;
                        }

                        return `
                            <li>
                                ${iconHtml}
                                <div class="notification-text">
                                    ${textHtml}
                                </div>
                                <span class="timestamp">${notif.time}</span>
                            </li>
                        `;
                    }).join('')}
                </ul>
            </section>
        `;
    }

    // Profile Page Renderer
    function renderProfilePage() {
        const currentUser = {
            id: 'u1',
            name: 'Chioma Nkechi',
            handle: '@chioma_nkechi',
            avatar: usersData.find(u => u.id === 'u1').avatar,
            cover: 'https://source.unsplash.com/random/800x200/?abstract-cover,geometric',
            bio: 'Tech enthusiast, aspiring entrepreneur, and lover of vibrant cultures. Building connections, one line of code at a time. 🇳🇬 #NigerianTech #FrontendDev',
            followers: 1250,
            following: 870,
            postsCount: 112,
            photos: [
                'https://source.unsplash.com/random/200x200/?landscape,african-art',
                'https://source.unsplash.com/random/200x200/?food,nigerian-dish',
                'https://source.unsplash.com/random/200x200/?city,lagos',
                'https://source.unsplash.com/random/200x200/?travel,nigeria',
                'https://source.unsplash.com/random/200x200/?coding,workspace',
                'https://source.unsplash.com/random/200x200/?portrait,smile'
            ]
        };

        const userPosts = postsData.filter(p => p.user_id === currentUser.id);

        appContent.innerHTML = `
            <section class="profile-section">
                <div class="profile-header" style="background-image: url('${currentUser.cover}');"></div>
                <div class="profile-pic-container">
                    <img src="${currentUser.avatar}" alt="${currentUser.name}'s Profile" class="profile-pic">
                </div>
                <h2>${currentUser.name}</h2>
                <p class="profile-handle">${currentUser.handle}</p>
                <p class="bio">${currentUser.bio}</p>
                <div class="profile-stats">
                    <div><strong>${currentUser.followers}</strong> <small>Followers</small></div>
                    <div><strong>${currentUser.following}</strong> <small>Following</small></div>
                    <div><strong>${currentUser.postsCount}</strong> <small>Posts</small></div>
                </div>
                <div class="profile-actions">
                    <button class="action-button"><i class="fas fa-edit"></i> Edit Profile</button>
                    <button class="action-button outline"><i class="fas fa-share-alt"></i> Share Profile</button>
                </div>

                <div class="profile-tabs">
                    <button data-tab="posts" class="active">Posts</button>
                    <button data-tab="photos">Photos</button>
                    <button data-tab="friends">Friends</button>
                </div>
                <div class="profile-content-area" id="profileContentArea">
                    </div>
            </section>
        `;

        const profileContentArea = document.getElementById('profileContentArea');

        // Function to render profile tab content
        function renderProfileTabContent(tabName) {
            let contentHtml = '';
            switch (tabName) {
                case 'posts':
                    if (userPosts.length === 0) {
                        contentHtml = '<p style="text-align:center; padding: 20px;">No posts yet.</p>';
                    } else {
                        userPosts.forEach(post => {
                            const user = usersData.find(u => u.id === post.user_id); // Should be current user
                            let mediaHtml = '';
                            if (post.type === 'image' && post.media) {
                                mediaHtml = `<img src="${post.media}" alt="Post Image">`;
                            } else if (post.type === 'video' && post.media) {
                                mediaHtml = `<video controls src="${post.media}" poster="https://picsum.photos/600/400?grayscale&blur=1" style="width:100%; border-radius:12px;"></video>`;
                            }
                            const formattedContent = post.content.replace(/#(\w+)/g, '<a href="#">#$1</a>').replace(/@(\w+)/g, '<a href="#">@$1</a>');
                            const likeClass = post.isLiked ? 'liked' : '';
                            const likeIcon = post.isLiked ? '<i class="fas fa-heart"></i>' : '<i class="far fa-heart"></i>';

                            contentHtml += `
                                <div class="post" data-post-id="${post.id}">
                                    <div class="post-header">
                                        <img src="${user.avatar}" alt="${user.name} Avatar" class="avatar">
                                        <div class="user-info">
                                            <strong>${user.name}</strong>
                                            <span>${user.handle} • ${post.timestamp}</span>
                                        </div>
                                    </div>
                                    <div class="post-content">
                                        ${mediaHtml}
                                        <p>${formattedContent}</p>
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
                                </div>
                            `;
                        });
                    }
                    break;
                case 'photos':
                    contentHtml = `
                        <div class="profile-photos-grid">
                            ${currentUser.photos.map(photo => `<img src="${photo}" alt="User Photo">`).join('')}
                        </div>
                    `;
                    break;
                case 'friends':
                    const friendsList = usersData.filter(u => u.id !== currentUser.id).slice(0, 5); // Simulate some friends
                    contentHtml = `
                        <ul>
                            ${friendsList.map(friend => `
                                <li style="display:flex; align-items:center; gap:15px; padding:10px 0; border-bottom:1px solid var(--border-color);">
                                    <img src="${friend.avatar}" alt="${friend.name}" class="avatar" style="width:50px; height:50px; border-width:2px;">
                                    <strong style="color:var(--text-color);">${friend.name}</strong>
                                    <span style="color:var(--text-color-light);">${friend.handle}</span>
                                    <button class="action-button outline" style="margin-left:auto; width:auto; padding:5px 10px; font-size:0.8em;"><i class="fas fa-user-times"></i> Unfriend</button>
                                </li>
                            `).join('')}
                        </ul>
                    `;
                    break;
            }
            profileContentArea.innerHTML = contentHtml;
        }

        // Event listeners for profile tabs
        const profileTabs = document.querySelectorAll('.profile-tabs button');
        profileTabs.forEach(tab => {
            tab.addEventListener('click', (event) => {
                profileTabs.forEach(t => t.classList.remove('active'));
                event.target.classList.add('active');
                renderProfileTabContent(event.target.dataset.tab);
            });
        });

        // Initial tab content
        renderProfileTabContent('posts');
    }

    // --- Core Navigation Logic (SPA simulation) ---
    function navigateTo(section) {
        bottomNavItems.forEach(item => {
            if (item.dataset.nav === section) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });

        switch (section) {
            case 'home':
                renderHomePage();
                break;
            case 'explore':
                renderExplorePage();
                break;
            case 'notifications':
                renderNotificationsPage();
                break;
            case 'profile':
                renderProfilePage();
                break;
            default:
                renderHomePage(); // Fallback
        }
    }

    // --- Initial Load ---
    navigateTo('home'); // Load home page initially

    // --- Event Listeners for Index.html ---

    // Dark Mode Toggle
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

    // FAB Button for New Post
    if (fabButton) { // Ensure FAB exists on the page
        fabButton.addEventListener('click', () => {
            alert('Opening Post Composer: What awesome thing will you share today? (This would open a modal or new page)');
            console.log('FAB clicked - new post initiated.');
        });
    }

    // Bottom Navigation
    bottomNavItems.forEach(item => {
        item.addEventListener('click', (event) => {
            event.preventDefault();
            const section = item.dataset.nav;
            navigateTo(section);
            console.log(`Navigating to: ${section}`);
        });
    });

    // --- Story Viewing (simulated) ---
    // Event delegation for stories section (needs to be attached to appContent)
    appContent.addEventListener('click', (event) => {
        const storyItem = event.target.closest('.story-item');
        const postInput = event.target.closest('.post-input');

        if (storyItem) {
            const storyId = storyItem.dataset.storyId;
            alert(`Viewing story by ${storyItem.querySelector('span').textContent}! (This would open a full-screen story viewer)`);
            console.log(`Story ${storyId} clicked.`);
        } else if (postInput) {
             alert('Composer activated! Start typing your post... (This would open a full composer modal/page)');
             postInput.focus(); // Give focus if it's an input field
             console.log('Post input clicked.');
        }
    });


    // --- Logic for messages.html only ---
    if (window.location.pathname.endsWith('messages.html')) {
        console.log('Messages Page Script Active');

        // Function to render conversation list
        function renderConversations() {
            if (!conversationList) return;
            conversationList.innerHTML = ''; // Clear previous
            conversationsData.forEach(conv => {
                const user = usersData.find(u => u.id === conv.user_id);
                if (!user) return;

                const convItem = document.createElement('div');
                convItem.classList.add('conversation-item');
                convItem.setAttribute('data-conv-id', conv.id);
                convItem.innerHTML = `
                    <img src="${user.avatar}" alt="${user.name}" class="conversation-avatar">
                    <div class="conversation-info">
                        <strong>${user.name}</strong>
                        <span>${conv.lastMessage}</span>
                    </div>
                    <span class="conversation-time">${conv.time}</span>
                `;
                conversationList.appendChild(convItem);
            });
        }
        renderConversations();

        // Function to render chat messages for a specific conversation
        function renderChatMessages(convId) {
            const conversation = conversationsData.find(c => c.id === convId);
            if (!conversation) return;

            const chatUser = usersData.find(u => u.id === conversation.user_id);
            if (chatUser) {
                chatWindowUserName.textContent = chatUser.name;
                chatWindowAvatar.src = chatUser.avatar;
                chatWindowAvatar.alt = chatUser.name;
                chatWindowStatus.textContent = conversation.status; // Display status
            }

            chatMessagesContainer.innerHTML = ''; // Clear messages
            conversation.messages.forEach(msg => {
                const msgBubble = document.createElement('div');
                msgBubble.classList.add('message-bubble', msg.sender);
                msgBubble.innerHTML = `
                    ${msg.text}
                    <span>${msg.timestamp}</span>
                `;
                chatMessagesContainer.appendChild(msgBubble);
            });
            chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight; // Scroll to bottom
        }

        // Event listener for opening chat window from conversation list
        conversationList.addEventListener('click', (event) => {
            const convItem = event.target.closest('.conversation-item');
            if (convItem) {
                const convId = convItem.dataset.convId;
                chatWindow.classList.add('active'); // Show chat window
                renderChatMessages(convId);
                // Store active conversation ID for sending messages
                chatWindow.dataset.activeConvId = convId;
                console.log(`Opened chat with ${convId}`);
            }
        });

        // Event listener for back button in chat window
        if (backToConversationsBtn) {
            backToConversationsBtn.addEventListener('click', () => {
                chatWindow.classList.remove('active'); // Hide chat window
                chatWindow.dataset.activeConvId = ''; // Clear active conversation
                console.log('Back to conversations list.');
            });
        }

        // Send Message Functionality
        if (sendMessageButton && messageInput) {
            sendMessageButton.addEventListener('click', () => sendMessage());
            messageInput.addEventListener('keypress', (event) => {
                if (event.key === 'Enter') {
                    sendMessage();
                }
            });

            function sendMessage() {
                const text = messageInput.value.trim();
                if (text === '') return;

                const activeConvId = chatWindow.dataset.activeConvId;
                const conversation = conversationsData.find(c => c.id === activeConvId);

                if (conversation) {
                    const newMessage = {
                        sender: 'self',
                        text: text,
                        timestamp: 'Just now'
                    };
                    conversation.messages.push(newMessage);
                    conversation.lastMessage = text; // Update last message

                    // Re-render messages to show new one
                    renderChatMessages(activeConvId);
                    messageInput.value = ''; // Clear input

                    // Simulate a reply from the other user (optional, for fun)
                    setTimeout(() => {
                        const replyMessage = {
                            sender: 'other',
                            text: `Got your message: "${text}". Thanks!`,
                            timestamp: 'Just now'
                        };
                        conversation.messages.push(replyMessage);
                        conversation.lastMessage = replyMessage.text;
                        renderChatMessages(activeConvId);
                    }, 1500); // Reply after 1.5 seconds
                    renderConversations(); // Update list to show new last message
                }
            }
        }
    } // End of messages.html specific logic
});
