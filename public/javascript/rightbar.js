document.addEventListener('DOMContentLoaded', () => {
    const tagContainer = document.getElementById('tagContainer');

    const loadTopTags = async () => {
      try {
        const response = await fetch('/post/my/all');
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
          .slice(0, 5)
          .map(tag => tag[0]);

        tagContainer.innerHTML = ''; // ล้างแท็กเก่า

        topTags.forEach(tag => {
          const tagElement = document.createElement('a');
          tagElement.href = '#';
          tagElement.textContent = tag;
          tagElement.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = `/search?keyword=${encodeURIComponent(tag)}`;
          });
          tagContainer.appendChild(tagElement);
          tagContainer.appendChild(document.createElement('br'));
        });
      } catch (error) {
        console.error('Error fetching tags:', error);
      }
    };

    loadTopTags();
  });