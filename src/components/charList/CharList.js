import { useState, useEffect, useRef } from 'react';
import './charList.scss';
import MarvelService from '../../services/MarvelService';
import PropTypes from 'prop-types';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

const CharList = (props) => {

    const [charList, setCharList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [newItemsLoading, setNewItemsLoading] = useState(false);
    const [offset, setOffset] = useState(210);
    const [charEnded, setCharEnded] = useState(false);

    const marvelService = new MarvelService();

    useEffect(() => {
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, [])

    useEffect(() => {
        if (newItemsLoading && !charEnded) {
            onRequest();
        }
    }, [newItemsLoading])

    const onScroll = () => {
        if (window.innerHeight + window.pageYOffset >= document.body.offsetHeight) {
            setNewItemsLoading(true)
        }
    };

    const onRequest = () => {
        onCharListLoading();
        marvelService.getAllCharacters(offset)
            .then(onCharsListLoaded)
            .catch(onError)
            .finally(() => setNewItemsLoading(false));

    }

    const onCharListLoading = () => {
        setNewItemsLoading(true);
    }

    const onCharsListLoaded = (newCharList) => {
        let ended = marvelService._totalCharacters - offset <= 9;

        setCharList(charList => [...charList, ...newCharList]);
        setLoading(false);
        setNewItemsLoading(false);
        setOffset(offset => offset + 9);
        setCharEnded(ended);
    }

    const onError = () => {
        setError(true)
        setLoading(false)
    }

    const itemRefs = useRef([]);

    const focusOnItem = (id) => {
        itemRefs.current.forEach(item => item.classList.remove('char__item_selected'));
        itemRefs.current[id].classList.add('char__item_selected');
        itemRefs.current[id].focus();
    }

    function renderItems(arr) {
        const items = arr.map((item, i) => {
            const { name, thumbnail } = item;

            const imgObjectFit = thumbnail.includes("image_not_available") ? { 'objectFit': 'unset' } : { 'objectFit': 'cover' };

            return (
                <li
                    className="char__item"
                    tabIndex={0}
                    key={item.id}
                    ref={el => itemRefs.current[i] = el}
                    onClick={() => {
                        props.onCharSelected(item.id);
                        focusOnItem(i);
                    }}
                    onKeyPress={(e) => {
                        if (e.key === ' ' || e.key === "Enter") {
                            props.onCharSelected(item.id);
                            focusOnItem(i);
                        }
                    }}
                >
                    <img style={imgObjectFit} src={thumbnail} alt={name} />
                    <div className="char__name">{name}</div>
                </li>
            )
        });

        return (
            <ul className='char__grid'>
                {items}
            </ul>
        )
    }

    const items = renderItems(charList);

    const errorMessage = error ? <ErrorMessage /> : null;
    const spinner = loading ? <Spinner /> : null;
    const content = !(loading || error) ? items : null;

    return (
        <div className="char__list">
            {errorMessage}
            {spinner}
            {content}
            <button
                className="button button__main button__long"
                disabled={newItemsLoading}
                style={{ "display": charEnded ? 'none' : 'block' }}
                onClick={() => onRequest(offset)}
            >
                <div className="inner">load more</div>
            </button>
        </div >
    )
}

CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired
}

export default CharList;