import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Cookies from 'universal-cookie';
import { useNavigate } from "react-router-dom"; //Rutas
import routes from "../index";
import arrow from "../img/arrow.png";
import '../styles/Categories.css';


function Categories() {
    const [registro, setRegistro] = useState(0);
    const [addCategory, setAddCategory] = useState(false);
    const [editing, setEditing] = useState(false);
    const [addCategoryMessage, setAddCategoryMessage] = useState("");
    const [firstTime, setFirstTime] = useState(true);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [myCategories, setMyCategories] = useState([]);
    const [getCats, setGetCats] = useState(0);
    const [deleteCat, setDeleteCat] = useState(0);
    const [editCat, setEditCat] = useState(0);
    const [idToDelete, setIdToDelete] = useState(0);
    const [idToEdit, setIdToEdit] = useState(0);
    const [categoryListMessage, setCategoryListMessage] = useState("");

    const [wordList, setWordList] = useState([{ word: "" }]);
    const [descriptionList, setDescriptionList] = useState([{ description: "" }]);

    const cookies = new Cookies();

    const [userData, setUserData] = useState({
        name: "",
        privacy: false,
        token: "",
        words: [],
    });

    const handleWordChange = (e, index) => {
        const { name, value } = e.target;
        const list = [...wordList];
        list[index][name] = value;
        setWordList(list);
    };

    const handleDescriptionChange = (e, index) => {
        const { name, value } = e.target;
        const list = [...descriptionList];
        list[index][name] = value;
        setDescriptionList(list);
    };

    const handleWordRemove = (index) => {
        const list = [...wordList];
        list.splice(index, 1);
        setWordList(list);

        const list2 = [...descriptionList];
        list2.splice(index, 1);
        setDescriptionList(list2);
    };

    const handleWordAdd = () => {
        setWordList([...wordList, { word: "" }]);
        setDescriptionList([...descriptionList, { description: "" }]);
    };

    const handleSetAddCategory = () => {
        setUserData({
            name: "",
            privacy: false,
            token: "",
            words: [],
        })
        setWordList([{ word: "" }])
        setDescriptionList([{ description: "" }])
        setEditing(false);
        // setCategoryListMessage("");
        setAddCategoryMessage("");
        setAddCategory(!addCategory);
        setGetCats(getCats + 1);
    };

    const handleSubmit = (event) => {
        if (editing) {
            setEditCat(editCat + 1);
        } else {
            setRegistro(registro + 1);
        }
    };

    function handleDelete(e) {
        setIdToDelete(e.target.id);
        setDeleteCat(deleteCat + 1);
    };

    const handleEdit = (e) => {
        // e.preventDefault();
        let id = e.target.id;
        setEditing(true);

        myCategories.forEach(category => {
            if (category.categoryId == id) {
                setIdToEdit(id);

                let wordList = [];
                let catList = [];
                let user = { name: category.categoryName, privacy: category.privacy == "public" ? true : false };

                category.words.forEach(word => {
                    wordList.push({ word: word.name })
                    catList.push({ description: word.description })
                });
                setWordList(wordList);
                setDescriptionList(catList);
                setUserData(user)
                setAddCategory(!addCategory);
            }
        });
    };
    function changeColor() {
        document
            .getElementById("add")
            .addEventListener("mouseover", function () {
                let colors = [
                    "#990000",
                    "#157425",
                    "#0d63aa",
                    "#788124",
                    "#c04d00",
                    "#132094",
                    "#c413c4",
                    "#229e98",
                    "#599c53",
                    "#7a31ce",
                    "#b17419",
                    "#4d2504",
                    "#ff7505",
                    "#db3c20",
                    "#358884",
                    "#356088",
                    "#b44567",
                    "#b4a345",
                    "#39862e",
                    "#80862e"
                ];
                let color = colors[Math.floor(Math.random() * 21)];
                document.getElementById("add").style.backgroundColor = color;
                document.getElementById("add").style.borderColor = color;
                document.getElementById("add").style.transition = 'all 0.2s';
            });
    }

    useEffect(() => {
        if (registro != 0) {
            const wordsAndDescription = [];

            for (let index = 0; index < wordList.length; index++) {
                let wordAdd = {
                    name: wordList[index].word,
                    description: descriptionList[index].description
                }
                wordsAndDescription.push(wordAdd);
            }

            const user = new FormData()
            user.append("name", userData.name);
            user.append("public", userData.privacy);
            user.append("token", cookies.get('token') != undefined ? cookies.get('token') : null);
            user.append("words", JSON.stringify(wordsAndDescription));

            fetch(routes.fetchLaravel + "addCategory", {
                method: 'POST',
                mode: 'cors',
                body: user,
                credentials: 'include'
            }).then((response) => response.json()).then((data) => {
                if (data.valid) {
                    setCategoryListMessage(`Category ${data.category.name} added correctly`);
                    let user = { name: "", privacy: false };
                    setUserData(user);
                    setWordList([{ word: "" }]);
                    setDescriptionList([{ description: "" }]);
                    handleSetAddCategory();
                } else {
                    setAddCategoryMessage(data.message)
                    if (data.wrongWords != null) {
                        setAddCategoryMessage(`${data.message} (${data.wrongWords})`)
                    }
                }
            }
            );
        }
    }, [registro]);

    useEffect(() => {
        setLoadingCategories(true);
        if (getCats != 0) {
            const user = new FormData()
            user.append("token", cookies.get('token') != undefined ? cookies.get('token') : null);

            fetch(routes.fetchLaravel + "getMyCategories", {
                method: 'POST',
                mode: 'cors',
                body: user,
                credentials: 'include'
            }).then((response) => response.json()).then((data) => {
                setMyCategories(data);
                setLoadingCategories(false);
            }
            );
        }
    }, [getCats]);

    useEffect(() => {
        if (deleteCat != 0 && idToDelete != 0) {
            const user = new FormData()
            user.append("token", cookies.get('token') != undefined ? cookies.get('token') : null);
            user.append("category_id", idToDelete);

            fetch(routes.fetchLaravel + "deleteCategory", {
                method: 'POST',
                mode: 'cors',
                body: user,
                credentials: 'include'
            }).then((response) => response.json()).then((data) => {
                if (data.valid) {
                    setGetCats(getCats + 1);
                    setCategoryListMessage(data.message);
                } else {
                    setCategoryListMessage(data.message);
                }
                setIdToDelete(0)
            }
            );
        }
    }, [deleteCat]);

    useEffect(() => {
        if (editCat != 0) {
            const wordsAndDescription = [];

            for (let index = 0; index < wordList.length; index++) {
                let wordAdd = {
                    name: wordList[index].word,
                    description: descriptionList[index].description
                }
                wordsAndDescription.push(wordAdd);
            }

            const user = new FormData()
            user.append("category_id", idToEdit);
            user.append("name", userData.name);
            user.append("public", userData.privacy);
            user.append("token", cookies.get('token') != undefined ? cookies.get('token') : null);
            user.append("words", JSON.stringify(wordsAndDescription));

            fetch(routes.fetchLaravel + "editCategory", {
                method: 'POST',
                mode: 'cors',
                body: user,
                credentials: 'include'
            }).then((response) => response.json()).then((data) => {
                if (data.valid) {
                    setCategoryListMessage(`Category ${userData.name} updated correctly`);
                    let user = { name: "", privacy: false };
                    setUserData(user);
                    setWordList([{ word: "" }]);
                    setDescriptionList([{ description: "" }]);
                    handleSetAddCategory();
                } else {
                    setAddCategoryMessage(data.message)
                    if (data.wrongWords != null) {
                        setAddCategoryMessage(`${data.message} (${data.wrongWords})`)
                    }
                }
            }
            );
        }
    }, [editCat]);

    useEffect(() => {
        if (firstTime) {
            setGetCats(getCats + 1);
            setFirstTime(false)
        }
    }, [])

    return (
        <>
            {!addCategory ?
                <>
                    <div className="form__goBack">
                        <div className="form__button--flex">
                            <Link to="/">
                                <button id="goBack__button">
                                    <span className="button-text">Go back</span>
                                </button>
                            </Link>
                        </div>
                    </div>
                    {!loadingCategories ?
                        <div>
                            {myCategories.length > 0 ?
                                <>
                                    <h1 style={{ textAlign: "center" }}>Categorias</h1>
                                    {categoryListMessage != "" && <h3 style={{ textAlign: "center" }}>{categoryListMessage}</h3>}
                                    <div className="myCategories">
                                        <table className="myCategories__table">
                                            <thead className="myCategories__thead">
                                                <tr className="myCategories__tr">
                                                    <th className="myCategories__th">Category</th>
                                                    <th className="myCategories__th">Nº words</th>
                                                    <th className="myCategories__th">Creation date</th>
                                                    <th className="myCategories__th">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="myCategories__tbody">
                                                {Array.isArray(myCategories)
                                                    ? myCategories.map((category, index) => (
                                                        <tr className="myCategories__tr" key={index}>
                                                            <td className="myCategories__td">{category.categoryName}</td>
                                                            <td className="myCategories__td">{category.numberOfWords}</td>
                                                            <td className="myCategories__td">{category.createdAt}</td>
                                                            <td className="myCategories__td"><i className="icon-edit" id={category.categoryId} onClick={handleEdit}></i> <i className="icon-trash" id={category.categoryId} onClick={handleDelete}></i></td>
                                                        </tr>

                                                    )) : null}
                                            </tbody>
                                            <tfoot>
                                                <tr className="myCategories__tfoot">
                                                    <td className="myCategories__td"></td>
                                                    <td className="myCategories__td"></td>
                                                    <td className="myCategories__td"></td>
                                                    <td className="myCategories__addCategoryButton"><button id="add" onMouseOver={changeColor} onClick={handleSetAddCategory}><i className="icon-plus"></i>Add category</button></td>
                                                </tr>
                                            </tfoot>
                                        </table>
                                    </div>
                                </>
                                :
                                <div className="NoCategory">
                                    <h1 style={{ textAlign: "center" }}>You haven't created any category yet!</h1>
                                    <div className="NoCategory__arrowBtn">
                                        <img src={arrow} alt=" " height={'110px'} />
                                        <button style={{ margin: '0 auto' }} className='NoCategory__addBtn' id="add" onMouseOver={changeColor} onClick={handleSetAddCategory}><i className="icon-plus"></i>Add category</button>
                                    </div>
                                </div>

                            }
                        </div> :
                        <h1>Loading categories...</h1>}
                </> :
                <div className="addCategory">
                    <div className="form__goBack">
                        <div className="form__button--flex">
                            <button id="add" onMouseOver={changeColor} style={{margin: '30px', height:'60px', width:'200px', letterSpacing:'1px', fontSize:'1.7rem'}} onClick={handleSetAddCategory}>
                                <span className="button-text">Category list</span>
                            </button>
                        </div>
                    </div>
                    <fieldset>
                        <legend className="addCategory__legend">ADD NEW CATEGORY</legend>
                        <br />
                        {addCategoryMessage != "" && <h3 style={{ textAlign: "center" }}>{addCategoryMessage}</h3>}
                        <div className="addCategory__form">
                            <div className="addCategory__nameTA">
                                <span className="addCategory__formSpanTA"><p className="addCategory__Name">CATEGORY NAME</p>
                                    <input className="input" id="name" type="text" placeholder="Introduce  category name" onChange={(e) => setUserData({ ...userData, name: e.target.value })} required /></span>
                            </div>
                        </div>
                        <form className="App" autoComplete="off">
                            <div className="form-field" id="scroll">
                                {wordList.map((singleWord, index) => (
                                    <div key={index} className="words">
                                        <div className="wordSettings">
                                            <div className="addCategory__form">
                                                <div className="addCategory__nameTA">
                                                    <span className="addCategory__formSpanTA">
                                                        <p className="addCategory__Word">Word</p>
                                                        <input className="input" name="word" type="text" id="word" placeholder="Introduce word" value={singleWord.word} onChange={(e) => handleWordChange(e, index)} required />
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="addCategory__form">
                                                <div className="addCategory__nameTA">
                                                    <span className="addCategory__formSpanTA">
                                                        <p className="addCategory__description">Description</p>
                                                        <textarea className="text-area" name="description" type="text" id="word" placeholder="Add a description :)" value={descriptionList[index].description} onChange={(e) => handleDescriptionChange(e, index)} required />
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        {wordList.length - 1 === index && wordList.length < 100 && (
                                            <button
                                                type="button"
                                                onClick={handleWordAdd}
                                                className="add-btn"
                                                id="add" onMouseOver={changeColor}
                                            >
                                                <span>Add a Word</span>
                                            </button>
                                        )}
                                        {wordList.length !== 1 && (
                                            <button
                                                type="button"
                                                onClick={() => handleWordRemove(index)}
                                                className="remove-btn"
                                                id="add" onMouseOver={changeColor}
                                                
                                            >
                                                <span>Remove</span>
                                            </button>
                                        )}
                                        <br />
                                    </div>
                                ))}
                            </div>
                        </form>

                        <div className="form__buttonsLinks">
                            <div className="form__buttons">
                                <label className="addCategory__public">
                                    <div  className="list__container__text">
                                        <input type="checkbox" id="check1"className="check" onChange={(e) => setUserData({ ...userData, privacy: e.target.checked })} required />
                                            <label htmlFor="check1" className="list__container__text__label" >
                                            <svg width="500" height="50" viewBox="0 0 500 100">
                                                <rect x="0" y="15" width="50" height="50" stroke="black" fill="none" className="list__container__checkbox" />
                                                <g transform="translate(-10,-962.36218)">
                                                    <path d="m 13,983 c 33,6 40,26 55,48 " stroke="black" strokeWidth="3" className="path1" fill="none" />
                                                    <path d="M 75,970 C 51,981 34,1014 25,1031 " stroke="black" strokeWidth="3" className="path1" fill="none" />
                                                </g>
                                            </svg>
                                            <span style={{ marginLeft: "-326px", marginTop: "10px" }}>Do you want the category to be public?</span>
                                        </label>

                                    </div>
                                    {/* <input className="addCategory__publicCheckbox" type="checkbox" onChange={(e) => setUserData({ ...userData, privacy: e.target.checked })} required></input> */}
                                    <p></p>
                                </label>
                                <div className="form__submit submit">
                                    <button onClick={handleSubmit} id="submit__button">
                                        <span className="button-text">SUBMIT</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </fieldset>
                </div>}
        </>
    );

}

export default Categories;