

//--------------View-------------------------------------------



class Renderer {

    static toDollars(price) {
        if (price) {
            return Intl.NumberFormat('de-DE', { style: 'currency', currency: 'USD' }).format(price);
        }
        return '-';
    }

    static prepareRow(name, price, quantity, index) {
        return `
            <td class="viewInTable name">${name}<span class="viewQuan">  ${quantity}  </span></td>
            <td>${Renderer.toDollars(price)}</td>
            <td>
                <button id="addnewproduct" type="button" class="btn btn-success" onclick="app.onEditclick(${index})">Edit</button>
                <button id="deletewproduct" type="button" class="btn btn-success" onclick="app.onDeleteclick(${index})">Delete</button>
            </td>`;

    }

    static editRow (name, price, quantity, index) {
        const tr = document.createElement('tr');
        tr.innerHTML = `
        <td class="viewInTable"><input id="newName" value=${name}><span class="viewQuan"> <input id="newQuantity" value=${quantity}>  </span></td>
            <td><input id="newPrice" value=${price}></td>
            <td>
                <button id="addnewproduct" type="button" class="btn btn-success" onclick="app.onUpdate(${index})">Save</button>
                <button id="deletewproduct" type="button" class="btn btn-success" onclick="app.onDeleteclick(${index})">Delete</button>
            </td>`;
        return tr;
    }

    renderTableRow(items) {
        const table = document.getElementById('tableBody');

        const newTable = document.createElement('tbody');
        newTable.id = 'tableBody';
        items.forEach((item, index) => {
            const tr = document.createElement('tr');
            tr.innerHTML = Renderer.prepareRow(item.name || '', item.price || 0, item.quantity, index);
            newTable.appendChild(tr);

        });
        table.replaceWith(newTable);
    }
    static editButton (index){
        let newBtn = document.createElement('div');
        newBtn.className = 'col-md-2 updatebtn';
        newBtn.innerHTML =`
                <button id="addnewproduct" type="button" class="btn btn-success inputInfo1" onclick="app.onUpdateSecond(${index})">Update</button>
            `;
        return newBtn;

    }

    renderValidClass(valid, el) {
        const element = document.getElementById(el);
        if (!valid) {
            element.style = 'border: 1px solid red';
        } else {
            element.style = '';
        }
    }
    static replaceRow(name, price, quantity, index) {
     const table = document.getElementById('tableBody');
     let tableRowcontent = table.rows[index];
     table.replaceChild(this.editRow(name, price, quantity, index),tableRowcontent);
    }

    static replaceRowNew(name, price, quantity, index) {
            document.getElementById('inputName').value = name;
            document.getElementById('inputPrice').value = price;
            document.getElementById('inputCount').value = quantity;
            const buttonChaned = document.querySelector('.fieldsRow');
            let newBtn = buttonChaned.children[3];
            buttonChaned.replaceChild(this.editButton(index), newBtn);

    }

    static hideRow (index) {
        const table = document.getElementById('tableBody');
        let tableRowcontent = table.rows[index];
        tableRowcontent.style.display = 'none';

    }
    static showRow (index) {
        const table = document.getElementById('tableBody');
        let tableRowcontent = table.rows[index];
        tableRowcontent.style.display = 'table-row';

    }

    static changeBtnOnAdd (){
        const buttonChaned = document.querySelector('.fieldsRow');
        let oldBtn = buttonChaned.children[3];
        let newBtn = document.createElement('div');
        newBtn.className = 'col-md-2 updatebtn';
        newBtn.innerHTML =`
               <button id="addUpdnewproduct" type="button" class="btn btn-success inputInfo1" onclick="app.onAddClick()">Add New</button>
            `;
        buttonChaned.replaceChild(newBtn, oldBtn);
    }





}
// -------------Model-------------------------
class Store {
    _items = [];
    _filter = '';
    _sort = {};

    render;

    constructor(render) {
        this.render = render;
    }

    addItem(item) {
       
        this._items.push(item);
        this.render.renderTableRow(this._items);
        
    }

    removeItem(index) {
        this._items.splice(index, 1);
        this.render.renderTableRow(this._items);
    }

    updateItem (item, index){
    this._items[index] = item;
    this.render.renderTableRow(this._items);
    }

    getItemByIdx(index) {
        return this._items[index];

    }

    searchEngine (searchfield) {
        this._items.forEach((item, index) => {if (item.name.includes(searchfield)) {
            return Renderer.showRow(index);
        }
        return Renderer.hideRow(index);
        });
    }

    sortingEngineNames (i,j){
        this._items.sort( (a, b) => { if (a.name > b.name) {
            return i;
        } if (a.name < b.name) {
            return j;
        } return 0;
        });
        this.render.renderTableRow(this._items);
    }

    sortingEnginePrice (i,j){
        this._items.sort( (a, b) => { if (a.price > +b.price) {
            return i;
        } if (a.price < +b.price) {
            return j;
        } return 0;
        });
        this.render.renderTableRow(this._items);
    }
}

//----------------------Controller-------------------------------------
class App {
    store;
    render;

    form = {
        inputName: [
            (str) => !!str.trim(),
            (str) => (str || '').length < 15
        ],
        inputCount: [],
        inputPrice: [],
    }

    constructor() {
        this.render = new Renderer();
        this.store = new Store(this.render);
    }

    onAddClick() {

        if (!this.isFormValid()) {
            return;
        }

        const name = document.getElementById('inputName').value,
              price = document.getElementById('inputPrice').value,
              quantity = document.getElementById('inputCount').value;

              document.get

        this.store.addItem({
            name,
            price,
            quantity,
        });
        this.clearFields();

    }

    onDeleteclick (index){
       if (confirm("Are you sure?")) {
           return this.store.removeItem(index);

       }
    }
    clearFields (){
        document.getElementById("inputName").value = "";
        document.getElementById("inputPrice").value = "";
        document.getElementById("inputCount").value = "";
    }
    onEditclick (index){
        const name = this.store.getItemByIdx(index).name,
            price = this.store.getItemByIdx(index).price,
            quantity = this.store.getItemByIdx(index).quantity;

        document.get
        Renderer.replaceRow(name, price, quantity, index);
        Renderer.replaceRowNew(name, price, quantity, index);
    }
    debugger;
    onUpdate (index){


        const name = document.getElementById('newName').value,
            price = document.getElementById('newPrice').value,
            quantity = document.getElementById('newQuantity').value;

        this.store.updateItem({
            name,
            price,
            quantity,
        }, index);
    }

    onSortName (){
        let arrow = document.getElementById('nameproduct').classList;
        if (arrow.contains('fa-sort')){
            this.store.sortingEngineNames(1,-1);
            return arrow = arrow.replace('fa-sort', 'fa-sort-down');

        }
        if (arrow.contains('fa-sort-down')){
            this.store.sortingEngineNames(-1,1);
            return arrow = arrow.replace('fa-sort-down', 'fa-sort-up')


        }
        if (arrow.contains('fa-sort-up')){
            arrow.replace('fa-sort-up', 'fa-sort-down');
            this.store.sortingEngineNames(1,-1);

        }
    }
    onSortPrice (){
        let arrow = document.getElementById('priceproduct').classList;
        if (arrow.contains('fa-sort')){
            this.store.sortingEnginePrice(1,-1);
            return arrow = arrow.replace('fa-sort', 'fa-sort-down');

        }
        if (arrow.contains('fa-sort-down')){
            this.store.sortingEnginePrice(-1,1);
            return arrow = arrow.replace('fa-sort-down', 'fa-sort-up')


        }
        if (arrow.contains('fa-sort-up')){
            arrow.replace('fa-sort-up', 'fa-sort-down');
            this.store.sortingEnginePrice(1,-1);

        }

    }
    onUpdateSecond(index){
        if (!this.isFormValid()) {
            return;
        }

        const name = document.getElementById('inputName').value,
            price = document.getElementById('inputPrice').value,
            quantity = document.getElementById('inputCount').value;

        document.get

        this.store.addItem({
            name,
            price,
            quantity,
        });
        this.clearFields();
        this.store.removeItem(index);
        Renderer.changeBtnOnAdd();

    }
    onSearch (){
        let searchfield = document.getElementById('search-text').value;
        this.store.searchEngine(searchfield);
    }

    isFormValid() {
        const name = document.getElementById('inputName').value,
              price = document.getElementById('inputPrice').value,
              quantity = document.getElementById('inputCount').value;

        if ((name =="")|| (price == "")|| (quantity == "")) {
            document.getElementById(inputName);
            return false;
        } else if ((name.length > 15) || (isNaN(name) == false)) {
            alert("error length or type of name");
            return false;
        }

        return true;
    }

    onTyping(element) {

    }

    checkValidation(el) {
        const value = document.getElementById(el).value;
        const isValid = this.form[el].reduce((result, vaildator) => {
            return result && vaildator(value)
        }, true);
        this.render.renderValidClass(isValid, el);
    }


}

const app = new App();

