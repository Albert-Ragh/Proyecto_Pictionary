import { useState, useEffect } from "react";
import "../styles/LobbyCreation.css";

function Categories({ socket, start, categoriesData }) {
  const [checked, setChecked] = useState([]);

  const handleCheck = (event) => {
    var updatedList = [...checked];
    if (event.target.checked) {
      updatedList = [...checked, event.target.value];
    } else {
      updatedList.splice(checked.indexOf(event.target.value), 1);
    }
    setChecked(updatedList);
  };

  useEffect(() => {
    socket.emit("set_categories", {
      ids: checked,
    });
  }, [checked]);

  return (
    <div className="checkList">
      <div className="list__container default">
        <h3 className="title">Default</h3>
        <div id="list__container_li">
          {Array.isArray(categoriesData.default)
            ? categoriesData.default.map((item, index) => (
              <div key={index} className="list__container__text">
                <input
                  value={item.categoryId}
                  type="checkbox"
                  id={item.categoryId}
                  className="check"
                  onChange={handleCheck}
                />
                <label
                  htmlFor={item.categoryId}
                  className="list__container__text__label"
                >
                  <svg width="300" height="50" viewBox="0 0 500 100">
                    <rect
                      x="0"
                      y="15"
                      width="50"
                      height="50"
                      stroke="black"
                      fill="none"
                      className="list__container__checkbox"
                    />
                    <g transform="translate(-10,-962.36218)">
                      <path
                        d="m 13,983 c 33,6 40,26 55,48 "
                        stroke="black"
                        stroke-width="3"
                        className="path1"
                        fill="none"
                      />
                      <path
                        d="M 75,970 C 51,981 34,1014 25,1031 "
                        stroke="black"
                        stroke-width="3"
                        className="path1"
                        fill="none"
                      />
                    </g>
                  </svg>
                  <span
                    htmlFor={item.categoryId}
                  >{`${item.categoryName}`}</span>
                </label>
              </div>
            ))
            : null}
        </div>
      </div>
      <div className="list__container public">
        <h3 className="title">Public</h3>
        <div id="list__container_li">
          {Array.isArray(categoriesData.public) && categoriesData.public != []
            ? categoriesData.public.map((item, index) => (
              <div key={index} className="list__container__text">
                <input
                  value={item.categoryId}
                  type="checkbox"
                  id={item.categoryId}
                  className="check"
                  onChange={handleCheck}
                />
                <label
                  htmlFor={item.categoryId}
                  className="list__container__text__label"
                >
                  <svg width="300" height="50" viewBox="0 0 500 100">
                    <rect
                      x="0"
                      y="15"
                      width="50"
                      height="50"
                      stroke="black"
                      fill="none"
                      className="list__container__checkbox"
                    />
                    <g transform="translate(-10,-962.36218)">
                      <path
                        d="m 13,983 c 33,6 40,26 55,48 "
                        stroke="black"
                        stroke-width="3"
                        className="path1"
                        fill="none"
                      />
                      <path
                        d="M 75,970 C 51,981 34,1014 25,1031 "
                        stroke="black"
                        stroke-width="3"
                        className="path1"
                        fill="none"
                      />
                    </g>
                  </svg>
                  <span htmlFor={item.categoryId} >
                    {`${item.categoryName}`}
                    <i className="icon-info-circle">
                      <div className="icon-info-circle__content">
                        Create By: {item.createdBy.name}
                        <br />
                        Nº Words: {item.numberOfWords}
                        <br />
                        Words:{" "}
                        {Array.isArray(item.words) ? (
                          item.words.map((word, index) => (
                            <li>{word.name}</li>
                          ))
                        ) : (
                          <></>
                        )}
                      </div>
                    </i>
                  </span>
                </label>
              </div>
            ))
            : null}
        </div>
      </div>

      <div className="list__container private">
        <h3 className="title">My categories</h3>
        {Array.isArray(categoriesData.myCategories) &&
          categoriesData.myCategories != []
          ? categoriesData.myCategories.map((item, index) => (
            <div key={index} className="list__container__text">
              <input
                value={item.categoryId}
                type="checkbox"
                id={item.categoryId}
                className="check"
                onChange={handleCheck}
              />
              <label
                htmlFor={item.categoryId}
                className="list__container__text__label"
              >
                <svg width="300" height="50" viewBox="0 0 500 100">
                  <rect
                    x="0"
                    y="15"
                    width="50"
                    height="50"
                    stroke="black"
                    fill="none"
                    className="list__container__checkbox"
                  />
                  <g transform="translate(-10,-962.36218)">
                    <path
                      d="m 13,983 c 33,6 40,26 55,48 "
                      stroke="black"
                      stroke-width="3"
                      className="path1"
                      fill="none"
                    />
                    <path
                      d="M 75,970 C 51,981 34,1014 25,1031 "
                      stroke="black"
                      stroke-width="3"
                      className="path1"
                      fill="none"
                    />
                  </g>
                </svg>
                <span
                  htmlFor={item.categoryId}
                >{`${item.categoryName}`}</span>
              </label>
            </div>
          ))
          : null}
      </div>
    </div>
  );
}

export default Categories;
