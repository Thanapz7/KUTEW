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

document.querySelector('.create-post').addEventListener('submit', function(event) {
    event.preventDefault();
    window.location.href = '/createpost';
  });

  document.addEventListener('DOMContentLoaded', async () => {
    try {
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

            feed.innerHTML = `
                <div class="head">
                    <div class="user">
                        <div class="profile-photo">
                            <img src="${profilePic}" alt="Tutor Profile Picture">
                        </div>
                        <div class="info">
                            <h3>${course.tutor_name}</h3>
                            <small>${formattedDate}</small>
                        </div>
                    </div>
                    <span class="join">
                        <button class="btn btn-primary">JOIN</button>
                    </span>
                </div>
                <div class="caption">
                    <i class="fa-solid fa-book"><p>${course.tag}</p></i>
                    <i class="fa-solid fa-newspaper"><p>${course.details}</p></i>
                    <i class="fa-solid fa-map-pin"><p>สถานที่: ${course.location}</p></i>
                </div>
            `;

            feedsContainer.appendChild(feed);
        });
    } catch (error) {
        console.error('Error fetching courses:', error);
    }
});


    async function fetchUserData() {
        try {
            const response = await fetch('/user/u');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const userData = await response.json();
            document.getElementById('user-name').textContent = userData.name;
        } catch (error) {
            console.error('Error fetching user data:', error);
            document.getElementById('user-name').textContent = 'Error loading name';
        }
    }

    // Call the function to fetch user data when the page loads
    window.onload = fetchUserData;

