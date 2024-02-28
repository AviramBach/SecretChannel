import { createApi } from 'unsplash-js';
import React, { useEffect, useState } from 'react';

const cache = {}


const unsplash = createApi({
    accessKey: '1xTGvRrc9qCkhiG3BhUb3dgE1b_prWl01OKkrr5vEPo',
})
var i = 0

export function Unsplash({ channelTheme }) {
    const [photos, setPhotos] = useState([]);

    useEffect(() => {

        if (cache[channelTheme]) {
            setPhotos(cache[channelTheme]);
        } else {

        unsplash.search.getPhotos({ query: channelTheme, page: 1, perPage: 1 })
            .then(response => {
                console.log('API Response:', response);
                i++
                if (response.response.results.length > 0) {
                    const photosData = response.response.results;
                        // Cache the API response
                        cache[channelTheme] = photosData;
                        setPhotos(photosData);
                } else {
                    console.log('No photos found in the response.');
                }
            })
            .catch(error => {
                console.log('Error fetching photos:', error);
            })
        }
        
        
    }, [channelTheme])

    if (photos.length === 0) return <div></div>;

    console.log(photos.length)
    console.log(i)

    return (
        <div>
            <div>
                {/* {photos.map(photo => (
                    <img key={photo.id} src={photo.urls.regular} alt={photo.alt_description} />
                ))} */}
                <img key={photos[0].id} src={photos[0].urls.regular} alt={photos[0].alt_description} />
            </div>
        </div>
    );
};