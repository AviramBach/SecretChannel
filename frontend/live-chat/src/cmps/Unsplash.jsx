import { createApi } from 'unsplash-js';
import React, { useEffect, useState } from 'react';


const unsplash = createApi({
    accessKey: '1xTGvRrc9qCkhiG3BhUb3dgE1b_prWl01OKkrr5vEPo',
})

export function Unsplash({ channelTheme }) {
    const [photos, setPhotos] = useState([]);

    useEffect(() => {
        unsplash.search.getPhotos({ query: channelTheme, page: 1, perPage: 1 })
            .then(response => {
                console.log('API Response:', response);

                if (response.response.results.length > 0) {
                    setPhotos(response.response.results);
                } else {
                    console.warn('No photos found in the response.');
                }
            })
            .catch(error => {
                console.error('Error fetching photos:', error);
            });
    }, []);

    if (photos.length === 0) return <div>Waiting on photos</div>;

    return (
        <div>
            <div>
                {photos.map(photo => (
                    <img key={photo.id} src={photo.urls.regular} alt={photo.alt_description} />
                ))}
            </div>
        </div>
    );
};