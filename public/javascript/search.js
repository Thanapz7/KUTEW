document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const searchInputMiddle = document.getElementById('searchInputMiddle');
    const feedsContainer = document.getElementById('feedsContainer');

    const performSearch = async (keyword) => {
        if (!keyword) {
            feedsContainer.innerHTML = ''; // ล้างผลลัพธ์ถ้าคำค้นหาว่างเปล่า
            return;
        }

        try {
            const response = await fetch(`/post/search?keyword=${encodeURIComponent(keyword)}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const posts = await response.json();

            feedsContainer.innerHTML = ''; // ล้างผลลัพธ์เก่า

            posts.forEach(post => {
                const postElement = document.createElement('div');
                postElement.classList.add('feed');

                const formattedDate = new Date(post.date).toISOString().split('T')[0];
                
                postElement.innerHTML = `
                    <div class="head">
                        <div class="user">
                            <div class="profile-photo">
                                <img src="${post.tutor_profilePic}" alt="Profile Photo" />
                            </div>
                            <div class="info">
                                <h3>${post.tutor_name}</h3>
                                <small>${formattedDate}</small>
                            </div>
                        </div>
                        <div class="icon-search">
                            <i class="fa-regular fa-star"></i>
                            <span>${post.request}</span>
                        </div>
                        <span class="join">
                            <button class="btn btn-primary">JOIN</button>
                        </span>
                        </div>
                    <div class="caption">
                        <i class="fa-solid fa-book"><p>Tag:<p class="p-font">${post.tag}</p> </p></i>
                        <i class="fa-solid fa-newspaper"><p>Details:<p class="p-font">${post.details}</p> </p></i>
                        <i class="fa-solid fa-map-pin"><p>Lacation:<p class="p-font">${post.location}</p> </p></i>
                    </div>
                `;

                feedsContainer.appendChild(postElement);
            });
        } catch (error) {
            console.error('Error fetching search results:', error);
        }
    };

    const getKeywordFromURL = () => {
        const params = new URLSearchParams(window.location.search);
        return params.get('keyword');
    };

    // ตรวจสอบถ้ามี keyword ใน URL
    const initialKeyword = getKeywordFromURL();
    if (initialKeyword) {
        searchInput.value = initialKeyword;
        searchInputMiddle.value = initialKeyword;
        performSearch(initialKeyword);
    }

    // เพิ่ม Event Listener ให้กับช่องค้นหาทั้งสอง
    searchInput.addEventListener('input', (e) => performSearch(e.target.value));
    searchInputMiddle.addEventListener('input', (e) => performSearch(e.target.value));

    const loadTopTags = async () => {
        const tagContainer = document.querySelector('.headtag-search');
        try {
            const response = await fetch('/post');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const posts = await response.json();

            const tagCounts = posts.reduce((acc, post) => {
                const tags = post.tag.split(','); // แยกแท็กถ้าเป็น String ที่มีหลายแท็กคั่นด้วย ,
                tags.forEach(tag => {
                    tag = tag.trim(); // ตัดช่องว่างหน้าหลังออก
                    acc[tag] = (acc[tag] || 0) + 1;
                });
                return acc;
            }, {});

            const topTags = Object.entries(tagCounts)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5); // เลือก 5 อันดับแท็กที่มีจำนวนมากที่สุด

            tagContainer.innerHTML = ''; // ล้างแท็กเก่า

            topTags.forEach(([tag, count]) => {
                const tagElement = document.createElement('a');
                tagElement.href = `/search?keyword=${encodeURIComponent(tag)}`;
                tagElement.textContent = `${tag}`;
                tagElement.addEventListener('click', (e) => {
                    e.preventDefault();
                    const keyword = tag;
                    searchInput.value = keyword;
                    searchInputMiddle.value = keyword;
                    performSearch(keyword);
                });
                tagContainer.appendChild(tagElement);
            });
        } catch (error) {
            console.error('Error fetching tags:', error);
        }
    };

    loadTopTags();
});
