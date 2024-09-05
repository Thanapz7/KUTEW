const menuItems = document.querySelectorAll('.menu-item');

    //remove active class from all 
const changeActiveItem = () =>{
    menuItems.forEach(item=>{
        item.classList.remove('active');
    })
}

menuItems.forEach(item =>{
    item.addEventListener('click', ()=>{
        changeActiveItem();
        item.classList.add('active');
        if(item.id != 'notifications'){
            document.querySelector('.notification-popup').
            style.display = 'none';
        }else{
            document.querySelector('.notification-popup').
            style.display = 'block';
            document.querySelector('#notifications .notification-count').style.display = 'none';
        }
    })
})

document.addEventListener('DOMContentLoaded', async () => {
    try {
      // Fetch total income from the /user/price API
      const incomeResponse = await fetch('/user/price');
      console.log(incomeResponse)
      const incomeData = await incomeResponse.json();
      console.log(incomeData)

      // Display the total income
      const totalIncomeElement = document.getElementById('total-income');
      totalIncomeElement.textContent = incomeData.price  || '0';
    } catch (error) {
      console.error('Error fetching income data:', error);
      document.getElementById('total-income').textContent = 'Error';
    }
  });

document.querySelector('.create-post').addEventListener('submit', function(event) {
    event.preventDefault();
    window.location.href = '/createpost';
  });

  document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Fetch user data to check their role
        const userResponse = await fetch('/user/u');
        const userData = await userResponse.json();
        const userRole = userData.role;
        
        const response = await fetch('/post/');
        const courses = await response.json();

        const feedsContainer = document.getElementById('feeds');
        courses.forEach(course => {
            const feed = document.createElement('div');
            feed.classList.add('feed');

            // Format date to YYYY-MM-DD
            const formattedDate = new Date(course.date).toISOString().split('T')[0];
            
            // Check if profilePic exists, if not use the default image
            const profilePic = course.profilePic ? course.profilePic : './img/racc.jfif';
            const post_id = course.post_id;

            feed.innerHTML = `
                <div class="head">
                    <div class="user">
                        <div class="profile-photo">
                            <img src="${profilePic}" alt="Tutor Profile Picture">
                        </div>
                        <div class="info">
                            <h3><a href="/profiletutor/${course.user_id}" class="tutor-link">${course.tutor_name}</a></h3>
                            <small>${formattedDate}</small>
                        </div>
                    </div>
                    <span class="join">
                        <button class="btn btn-primary join-btn">JOIN</button>
                    </span>
                </div>
                <div class="caption">
                    <i class="fa-solid fa-clock"><p>Date:<p class="p-font">${formattedDate}</p> </p></i>
                    <i class="fa-solid fa-book"><p>Tag:<p class="p-font">${course.tag}</p> </p></i>
                    <i class="fa-solid fa-newspaper"><p>Detail:<p class="p-font">${course.details}</p> </p></i>
                    <i class="fa-solid fa-map-pin"><p>Location:<p class="p-font">${course.location}</p> </p></i>
                </div>
            `;

            // ซ่อนปุ่ม "JOIN" เมื่อผู้ใช้เป็นติวเตอร์
        if (userRole === 'tutor') {
            const joinButtonSpan = feed.querySelector('.join');
            if (joinButtonSpan) {
                joinButtonSpan.style.display = 'none';
            }
        }
            const joinButton = feed.querySelector('.join-btn');
            joinButton.addEventListener('click', () => {
                window.location.href = `/joinclass?post_id=${post_id}`;
            });

            feedsContainer.appendChild(feed);
        });
    } catch (error) {
        console.error('Error fetching courses:', error);
    }
});

document.addEventListener('DOMContentLoaded', async () => {
    try {
        // เรียก API เพื่อตรวจสอบบทบาทของผู้ใช้
        const response = await fetch('/user/u');
        const userData = await response.json();

        const userRole = userData.role;

        // ซ่อนฟอร์มถ้าผู้ใช้เป็น student
        if (userRole === 'student') {
            const createPostForm = document.querySelector('.create-post');
            const showIncome = document.querySelector('.show-income');
            if (createPostForm) {
                createPostForm.style.display = 'none';
            }
            if(showIncome){
                showIncome.style.display = 'none';
            }
        }


    } catch (error) {
        console.error('Error fetching user data:', error);
    }
});







