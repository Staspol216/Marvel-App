import './charSearchForm.scss';
import useMarvelService from '../../services/MarvelService';

import { useState } from 'react';
import { Formik, Form, Field, ErrorMessage as FormikErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';


const CharSearchForm = () => {

    const [char, setChar] = useState(null);
    const [searchStatus, setSearchStatus] = useState(null);

    const { getCharacterByName, clearError } = useMarvelService();


    const onRequest = (values) => {
        clearError();
        setSearchStatus(false);
        getCharacterByName(values.name)
            .then(char => setChar(char))
            .catch(() => setSearchStatus(true));
    }

    console.log(char);

    const linkBtn = char ? <div className="char__search-wrapper">
        <div className="char__search-success">There is! Visit page?</div>
        <a href='#' className="button button__secondary">
            <div className="inner">To page</div>
        </a>
    </div> : null;

    console.log(char == null);

    const charNotFound = searchStatus ? <div className="char__search-error">
        The character was not found. Check the name and try again
    </div> : null;

    return (
        <div className="char__search-form">
            <Formik
                initialValues={{
                    name: '',
                }}
                validationSchema={Yup.object({
                    name: Yup.string().required('This field is required')
                })}
                onSubmit={values => onRequest(values)}>
                <Form>
                    <label className="char__search-label" htmlFor="name">Or find a character by name:</label>
                    <div className="char__search-wrapper">
                        <Field
                            id="name"
                            name='name'
                            type='text'
                            placeholder="Enter name" />

                        <button
                            type='submit'
                            className="button button__main">
                            <div className="inner">find</div>
                        </button>
                    </div>
                    <FormikErrorMessage component="div" className="char__search-error" name="name" />
                </Form>
            </Formik>
            {linkBtn}
            {charNotFound}
        </div>
    )
}

export default CharSearchForm;