import { useState, useEffect } from "@wordpress/element";
import apiFetch from "@wordpress/api-fetch";

/**
 * Custom hook for managing WordPress pages
 */
export const usePages = () => {
    const [pages, setPages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch WordPress pages
    const fetchPages = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await apiFetch({ path: "/easeaccess-lite/v1/pages" });
            setPages(response || []);
        } catch (err) {
            console.error('Error fetching pages:', err);
            setError(err.message || 'Failed to fetch pages');
            setPages([]);
        } finally {
            setIsLoading(false);
        }
    };

    // Find page by ID
    const findPageById = (id) => {
        return pages.find(page => page.id === id);
    };

    // Find page by URL
    const findPageByUrl = (url) => {
        return pages.find(page => page.url === url);
    };

    // Get pages formatted for select options
    const getPagesForSelect = () => {
        return pages.map(page => ({
            value: page.url,
            label: page.title,
            id: page.id,
            slug: page.slug,
        }));
    };

    // Initial fetch on mount
    useEffect(() => {
        fetchPages();
    }, []);

    return {
        pages,
        isLoading,
        error,
        fetchPages,
        findPageById,
        findPageByUrl,
        getPagesForSelect,
    };
};

export default usePages;