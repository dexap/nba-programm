import React, { useEffect } from 'react';

const SEO = ({ title, description, keywords, image, url }) => {
    const siteTitle = "NBA Head-to-Head & Schedule Difficulty";
    const defaultDescription = "Analyze NBA standings with head-to-head records and evaluate schedule difficulty for upcoming and past games. The ultimate tool for NBA fans.";
    const defaultKeywords = "NBA, basketball, standings, head-to-head, schedule difficulty, strength of schedule, NBA stats";
    const defaultImage = "/h2h_logo.png";
    const siteUrl = "https://nba-h2h-analytics.vercel.app";

    const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle;
    const finalDescription = description || defaultDescription;
    const finalKeywords = keywords || defaultKeywords;
    const finalImage = image || defaultImage;
    const finalUrl = url || siteUrl;

    useEffect(() => {
        // Update Title
        document.title = fullTitle;

        // Helper to update meta tags
        const updateMeta = (name, content, attribute = 'name') => {
            let element = document.querySelector(`meta[${attribute}="${name}"]`);
            if (!element) {
                element = document.createElement('meta');
                element.setAttribute(attribute, name);
                document.head.appendChild(element);
            }
            element.setAttribute('content', content);
        };

        // Standard Meta
        updateMeta('description', finalDescription);
        updateMeta('keywords', finalKeywords);

        // Open Graph
        updateMeta('og:title', fullTitle, 'property');
        updateMeta('og:description', finalDescription, 'property');
        updateMeta('og:image', finalImage, 'property');
        updateMeta('og:url', finalUrl, 'property');
        updateMeta('og:type', 'website', 'property');

        // Twitter
        updateMeta('twitter:title', fullTitle, 'property');
        updateMeta('twitter:description', finalDescription, 'property');
        updateMeta('twitter:image', finalImage, 'property');
        updateMeta('twitter:card', 'summary_large_image', 'property');

    }, [fullTitle, finalDescription, finalKeywords, finalImage, finalUrl]);

    return null; // This component doesn't render anything visible
};

export default SEO;
