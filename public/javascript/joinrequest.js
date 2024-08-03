document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('postId');

    try {
        const response = await fetch(`/join/${postId}`);
        const data = await response.json();
        const post = data.post;  // ข้อมูลโพสต์
        const joinRequests = data.results; // ข้อมูลคำขอเข้าร่วม

        // การตั้งค่าภาพและชื่อโปรไฟล์
        document.querySelector('.profile-joinrequest img').src = post.image;
        document.querySelector('.info h3').textContent = post.author;

        // การตั้งค่าข้อมูลอื่น ๆ
        document.querySelector('.caption-join-1:nth-of-type(1) p').textContent = post.student_name;
        document.querySelector('.caption-join-1:nth-of-type(2) p').textContent = post.details;
        document.querySelector('.caption-join-1:nth-of-type(3) p').textContent = post.location;
    } catch (error) {
        console.error('Error loading join requests:', error);
    }
});
