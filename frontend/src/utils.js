export const createElement = (elementType, classNameArray) => {
    const newElement = document.createElement(elementType);
    if(classNameArray){
        classNameArray.forEach(ele => {
            newElement.classList.add(`${ele}`)
        })
    }
    
    return newElement
}

export const clearChildElements = (parentElement) => {
    while (parentElement.firstChild) {
        parentElement.removeChild(parentElement.lastChild);
      }
}
