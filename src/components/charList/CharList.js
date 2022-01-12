import { Component } from 'react';
import './charList.scss';
import abyss from '../../resources/img/abyss.jpg';
import MarvelService from '../../services/MarvelService';

class CharList extends Component {
    state = {
        chars: [],
        loading: false,
        error: false
    }

    marvelService = new MarvelService();

    onCharLoaded = (chars) => {
        this.setState({ chars: chars, loading: false })
        console.log(this.state.chars);
    }

    onError = () => {
        this.setState({
            error: true
        })
    }

    updateChars = () => {
        this.setState({
            error: false
        })
        this.marvelService
            .getAllCharacters()
            .then(this.onCharLoaded)
            .catch(this.onError)
    }

    componentDidMount() {
        this.updateChars();
    }

    render() {
        const { chars } = this.state;

        const elements = chars.map(item => {
            const { name, thumbnail } = item;

            return (
                <li className="char__item">
                    <img src={thumbnail} alt="Hero" />
                    <div className="char__name">{name}</div>
                </li>
            )
        })

        return (
            <div className="char__list">
                <ul className="char__grid">
                    {elements}
                </ul>
                <button className="button button__main button__long">
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
}

export default CharList;