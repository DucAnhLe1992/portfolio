import type { Article, Project } from '@/content/types';
import { carRental } from '@/content/projects/car-rental';
import { codeNotebook } from '@/content/projects/code-notebook';
import { ticketBooking } from '@/content/projects/ticket-booking';
import { checkoutRedirect } from '@/content/writing/checkout-redirect';
import { overlappingReservations } from '@/content/writing/overlapping-reservations';

const projects: Project[] = [carRental, codeNotebook, ticketBooking];
const articles: Article[] = [checkoutRedirect, overlappingReservations];

export function getProjects() {
  return projects;
}

export function getFeaturedProjects() {
  return projects.filter((p) => p.featured);
}

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug) ?? null;
}

export function getArticles() {
  return articles
    .filter((a) => !a.draft)
    .sort((a, b) => b.published.localeCompare(a.published));
}

export function getArticle(slug: string) {
  return getArticles().find((a) => a.slug === slug) ?? null;
}

export function formatDate(iso: string) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export const kindLabel: Record<Project['kind'], string> = {
  personal: 'Personal project',
  'course-derived': 'Course-derived',
  professional: 'Professional',
};
