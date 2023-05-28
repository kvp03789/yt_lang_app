export const createElement = (elementType, classNameArray) => {
    const newElement = document.createElement(elementType);
    classNameArray.forEach(ele => {
        newElement.classList.add(`${ele}`)
    })
    return newElement
    
}