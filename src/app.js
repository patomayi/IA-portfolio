import './styles.css';
import config from './data/config.json';
import projects from './data/projects.json';

const setText = (selector, value) => {
	document.querySelectorAll(selector).forEach((element) => {
		element.textContent = value;
	});
};

const initials = config.name
	.trim()
	.split(/\s+/)
	.slice(0, 2)
	.map((part) => part.charAt(0))
	.join('')
	.toUpperCase();

document.title = `${config.name} | Portfolio`;
setText('[data-profile="name"]', config.name);
setText('[data-profile="initials"]', initials);
setText('[data-profile="profession"]', config.profession);
setText('[data-profile="headline"]', config.headline);
if (config.location?.trim()) {
	setText('[data-profile="location"]', config.location);
} else {
	document.querySelector('.hero-location').remove();
}

const aboutContainer = document.querySelector('[data-profile="about"]');
config.about.forEach((paragraph) => {
	const element = document.createElement('p');
	element.textContent = paragraph;
	aboutContainer.append(element);
});

const projectsContainer = document.querySelector('[data-projects]');
projects.forEach((project, index) => {
	const card = document.createElement('article');
	card.className = 'project-card';

	const visual = document.createElement('div');
	visual.className = 'project-visual';
	visual.setAttribute('aria-hidden', 'true');
	const number = document.createElement('span');
	number.className = 'project-number';
	number.textContent = String(index + 1).padStart(2, '0');
	const mark = document.createElement('span');
	mark.className = 'project-mark';
	mark.textContent = project.category.slice(0, 1).toUpperCase();
	visual.append(number, mark);

	const content = document.createElement('div');
	content.className = 'project-content';
	const category = document.createElement('p');
	category.className = 'project-category';
	category.textContent = project.category;
	const title = document.createElement('h3');
	title.textContent = project.name;
	const description = document.createElement('p');
	description.className = 'project-description';
	description.textContent = project.description;

	const metadata = document.createElement('div');
	metadata.className = 'project-meta';
	if (project.isExample) {
		const example = document.createElement('span');
		example.className = 'example-label';
		example.textContent = 'Proyecto de ejemplo';
		metadata.append(example);
	}
	project.technologies.forEach((technology) => {
		const tag = document.createElement('span');
		tag.className = 'technology-tag';
		tag.textContent = technology;
		metadata.append(tag);
	});

	content.append(category, title, description, metadata);
	if (project.url) {
		const projectLink = document.createElement('a');
		projectLink.className = 'project-link';
		projectLink.href = project.url;
		projectLink.target = '_blank';
		projectLink.rel = 'noopener noreferrer';
		projectLink.textContent = 'Ver proyecto';
		projectLink.setAttribute('aria-label', `Ver proyecto: ${project.name} (se abre en una pestaña nueva)`);
		content.append(projectLink);
	}

	card.append(visual, content);
	projectsContainer.append(card);
});

const skillsContainer = document.querySelector('[data-skills]');
config.skills.forEach((skill) => {
	const item = document.createElement('li');
	item.textContent = skill;
	skillsContainer.append(item);
});

const contactLinks = document.querySelector('[data-contact-links]');
const contactEntries = [
	['email', 'Email', (value) => `mailto:${value}`],
	['github', 'GitHub', (value) => value],
	['linkedin', 'LinkedIn', (value) => value],
	['website', 'Sitio web', (value) => value],
];
contactEntries.forEach(([key, label, getHref]) => {
	const value = config.contact?.[key];
	if (!value) return;

	const link = document.createElement('a');
	link.className = 'contact-link';
	link.href = getHref(value);
	link.textContent = key === 'email' ? value : label;
	if (key !== 'email') {
		link.target = '_blank';
		link.rel = 'noopener noreferrer';
		link.setAttribute('aria-label', `${label} (se abre en una pestaña nueva)`);
	}
	contactLinks.append(link);
});

setText('[data-current-year]', String(new Date().getFullYear()));

const menuToggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#primary-navigation');
const mobileViewport = window.matchMedia('(max-width: 760px)');

const closeMenu = ({ returnFocus = false } = {}) => {
	menuToggle.setAttribute('aria-expanded', 'false');
	menuToggle.setAttribute('aria-label', 'Abrir navegación');
	navigation.classList.remove('is-open');
	if (returnFocus) menuToggle.focus();
};

menuToggle.addEventListener('click', () => {
	const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
	menuToggle.setAttribute('aria-expanded', String(!isExpanded));
	menuToggle.setAttribute(
		'aria-label',
		isExpanded ? 'Abrir navegación' : 'Cerrar navegación',
	);
	navigation.classList.toggle('is-open', !isExpanded);
});

navigation.querySelectorAll('a').forEach((link) => {
	link.addEventListener('click', () => closeMenu());
});

document.addEventListener('keydown', (event) => {
	if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
		closeMenu({ returnFocus: true });
	}
});

mobileViewport.addEventListener('change', (event) => {
	if (!event.matches) closeMenu();
});
