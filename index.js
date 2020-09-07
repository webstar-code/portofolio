AOS.init();

const topprojects = [
  {
    name: 'Travel Log',
    imageURl: './images/project_images/travle_log_middle.png',
    description: 'Mark your favorites places you visited',
    stack: ['React', 'Nodejs', 'express', 'mongoDB'],
    websiteURL: 'https://travel-log-app-ebon.now.sh/',
    githubURL: 'https://github.com/webstar-code/travel_log/'
  },
  {
    name: 'MemeMaker',
    imageURl: './images/project_images/mememaker.png',
    description: 'Create and download memes instantly',
    stack: ['Html', 'css', 'Jquery'],
    websiteURL: 'https://mememaker.now.sh',
    githubURL: 'https://github.com/webstar-code/MemeMaker'
  },
  {
    name: 'SciCalculator',
    imageURl: './images/project_images/Sci-calculator.png',
    description: 'Quickly Calcualte the physics formulas --Dark mode Available',
    stack: ['Html', 'css', 'Js'],
    websiteURL: 'https://sci-calculator.netlify.app/',
    githubURL: 'https://github.com/webstar-code/SciCalculator'
  },
]

const projects = [

  {
    name: 'RecipeApp',
    description: 'Get Food recipes',
    stack: ['React', 'MaterialUI', 'Responsive'],
    websiteURL: 'https://apprecipe.herokuapp.com/',
    githubURL: 'https://github.com/webstar-code/recipe'
  },
  {
    name: 'PubgClone',
    description: 'Pubg HomePage Clone',
    stack: ['Html', 'css', 'Js', 'Responsive'],
    websiteURL: 'https://pubgClone.netlify.app/',
    githubURL: 'https://github.com/webstar-code/PubgClone'
  },
  {
    name: 'UberClone',
    description: 'Uber HomePage Clone',
    stack: ['Html', 'tailwindcss', 'Js', 'Responsive'],
    websiteURL: 'https://uberClone.netlify.app/',
    githubURL: 'https://github.com/webstar-code/UberClone'
  },


]




topprojects.map(project => {
  const topproject__item = `
  <div class="project__item">
  
      <div class="img__container">
   <img src="${project.imageURl}" alt="" style="width: 100%;"> 

      </div>
      <div class="project__info">
        <h3>${project.name}</h3>
        <p>${project.description}</p>
          <div class="stack">
          <p>stack:</p>
          ${project.stack.map(item => `${item}`)}
          </div>
        <p>website: <a href="${project.websiteURL}">${project.websiteURL}</a></p>
        <p>github: <a href="${project.githubURL}">${project.githubURL}</a></p>
      </div> 
  </div>
`;
  const div = document.createElement('div');
  div.innerHTML = topproject__item;
  document.querySelector('.topproject__items').appendChild(div);
})


projects.map(project => {
  const project_item = `
  <div class="project__item">
  <div class="project__info">
    <h3>${project.name}</h3>
    <p>${project.description}</p>
      <div class="stack">
      <p>stack:</p>
      ${project.stack.map(item => `${item}`)}
      </div>
    <p>website: <a href="${project.websiteURL}">${project.websiteURL}</a></p>
    <p>github: <a href="${project.githubURL}">${project.githubURL}</a></p>
  </div> 
</div>
`;

const div = document.createElement('div');
div.innerHTML = project_item;
document.querySelector('.allprojects__items').appendChild(div);
})

const show_more = document.querySelector('.show_more');
show_more.addEventListener('click', (e) => {
  e.target.style.display = 'none';
document.querySelector('.allprojects__items').style.display = 'block';

})  