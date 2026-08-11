/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Work {
  id: string;
  title: string;
  category: string;
  year?: string;
  imageUrl: string;
  fullImageUrl?: string;
  description?: string;
  technique?: string;
  dimensions?: string;
  seriesTitle?: string;
}

export interface PressArticle {
  title: string;
  source: string;
  date: string;
  link?: string;
  type?: 'Artículo' | 'Entrevista';
  summary?: string;
}
