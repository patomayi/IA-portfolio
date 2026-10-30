import './styles.css';
import config from './data/config.json';
import projects from './data/projects.json';
import emmaPhoto from './images/emma.jpeg';

document.querySelector('.hero-photo img').src = emmaPhoto;

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

document.title = `${config.name} | Desarrolladora de software y portfolio`;
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
const createProjectArtwork = (project) => {
	const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
	svg.setAttribute('viewBox', '0 0 260 200');
	svg.setAttribute('class', 'project-artwork');
	svg.setAttribute('aria-hidden', 'true');

	const categoryText = project.category.toLowerCase();
	const isAi = categoryText.includes('inteligencia') || categoryText.includes('ai');
	const isDatabase = categoryText.includes('base') || categoryText.includes('sql') || categoryText.includes('postgres');
	const isWeb = categoryText.includes('php') || categoryText.includes('web') || categoryText.includes('desarrollo');

	if (isAi) {
		const lines = [
			'<path d="M40 150 L92 118 L140 150 L188 122 L220 150" />',
			'<path d="M92 118 L92 78 M140 150 L140 110 M188 122 L188 88" />',
			'<circle cx="92" cy="78" r="8" />',
			'<circle cx="140" cy="110" r="8" />',
			'<circle cx="188" cy="88" r="8" />',
			'<circle cx="40" cy="150" r="8" />',
			'<circle cx="220" cy="150" r="8" />',
		];
		svg.innerHTML = `
			<g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
				${lines.join('')}
			</g>
		`;
	} else if (isDatabase) {
		svg.innerHTML = `
			<g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
				<ellipse cx="130" cy="72" rx="58" ry="20" />
				<path d="M72 72 V124 C72 138 92 150 130 150 C168 150 188 138 188 124 V72" />
				<path d="M72 92 H188" />
				<path d="M72 112 H188" />
				<path d="M72 124 Q130 140 188 124" />
				<path d="M92 60 V136" opacity="0.65" />
				<path d="M168 60 V136" opacity="0.65" />
			</g>
		`;
	} else if (isWeb) {
		svg.innerHTML = `
			<g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
				<rect x="58" y="56" width="144" height="92" rx="8" />
				<path d="M58 82 H202" />
				<path d="M86 120 H128" />
				<path d="M86 132 H156" />
				<path d="M92 50 L130 26 L168 50" opacity="0.7" />
			</g>
		`;
	} else {
		svg.innerHTML = `
			<g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
				<path d="M70 130 L130 60 L190 130 L130 170 Z" />
				<path d="M130 60 L130 170 M70 130 L190 130" opacity="0.7" />
			</g>
		`;
	}

	return svg;
};

projects.forEach((project, index) => {
	const card = document.createElement('article');
	card.className = 'project-card';

	const visual = document.createElement('div');
	visual.className = 'project-visual';
	visual.setAttribute('aria-hidden', 'true');
	const number = document.createElement('span');
	number.className = 'project-number';
	number.textContent = String(index + 1).padStart(2, '0');
	const mark = createProjectArtwork(project);
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

const linkedinCardContainer = document.querySelector('[data-linkedin-card]');
if (config.contact?.linkedin) {
	const linkedinCard = document.createElement('a');
	linkedinCard.className = 'linkedin-card';
	linkedinCard.href = config.contact.linkedin;
	linkedinCard.target = '_blank';
	linkedinCard.rel = 'noopener noreferrer';
	linkedinCard.setAttribute('aria-label', `Ver el perfil de ${config.name} en LinkedIn (se abre en una pestaña nueva)`);

	const linkedinMark = document.createElement('span');
	linkedinMark.className = 'linkedin-card-mark';
	linkedinMark.setAttribute('aria-hidden', 'true');
	linkedinMark.textContent = 'in';

	const linkedinCopy = document.createElement('span');
	linkedinCopy.className = 'linkedin-card-copy';
	const linkedinLabel = document.createElement('span');
	linkedinLabel.className = 'linkedin-card-platform';
	linkedinLabel.textContent = 'LinkedIn';
	const linkedinName = document.createElement('strong');
	linkedinName.className = 'linkedin-card-name';
	linkedinName.textContent = config.name;
	const linkedinAction = document.createElement('span');
	linkedinAction.className = 'linkedin-card-action';
	linkedinAction.textContent = 'Ver perfil profesional ↗';
	linkedinCopy.append(linkedinLabel, linkedinName, linkedinAction);
	linkedinCard.append(linkedinMark, linkedinCopy);
	linkedinCardContainer.append(linkedinCard);
	linkedinCardContainer.hidden = false;
}

setText('[data-current-year]', String(new Date().getFullYear()));

const menuToggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#primary-navigation');
const themeToggle = document.querySelector('.theme-toggle');
const mobileViewport = window.matchMedia('(max-width: 760px)');
const THEME_KEY = 'portfolio-theme';

const getPreferredTheme = () => {
	const storedTheme = localStorage.getItem(THEME_KEY);
	if (storedTheme === 'dark' || storedTheme === 'light') return storedTheme;
	return 'dark';
};

const applyTheme = (theme) => {
	document.documentElement.setAttribute('data-theme', theme);
	document.documentElement.style.colorScheme = theme;
	const isDark = theme === 'dark';
	themeToggle.setAttribute('aria-pressed', String(isDark));
	themeToggle.setAttribute('aria-label', isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');
	const toggleThumb = themeToggle.querySelector('.toggle-thumb');
	const toggleLabel = themeToggle.querySelector('.theme-toggle-label');
	toggleThumb.textContent = isDark ? '☀' : '☾';
	toggleLabel.textContent = isDark ? 'Modo claro' : 'Modo oscuro';
	localStorage.setItem(THEME_KEY, theme);
};

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

themeToggle.addEventListener('click', () => {
	const nextTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
	applyTheme(nextTheme);
});

applyTheme(getPreferredTheme());

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
