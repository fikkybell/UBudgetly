const links = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section');


links.forEach(link => {
  link.addEventListener('click', function (e) {
    e.preventDefault(); 

  
    links.forEach(link => link.classList.remove('active'));
    this.classList.add('active');


    const targetId = this.getAttribute('href').slice(1);
    console.log(targetId)
    sections.forEach(section => {
      if (section.id === targetId) {
        section.classList.remove('hidden');
      } else {
        section.classList.add('hidden');
      }
    });
  });
});
