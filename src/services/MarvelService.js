
class MarvelService {
    getResource = async (url) => {
        let res = await fetch(url);

        if (!res.ok) {
            throw new Error(`Could not fetch ${url}, status: ${res.status}`);
        }

        return await res.json();
    }

    getAllCharacter = () => {
        return this.getResource('https://gateway.marvel.com:443/v1/public/characters?apikey=625ff54ef79e9d050ec20b0352f32ff6');
    }
}

export default MarvelService;