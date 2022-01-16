'use strict';

import '../scss/app.scss';

const container = document.querySelector('.container');
const from = document.querySelector('#from');
const to = document.querySelector('#to');
const sort = document.querySelector('#sort');
const btnSearch = document.querySelector('#search');
const btnChange = document.querySelector('#change');
const btnReset = document.querySelector('#reset');
const box = document.querySelector('template');

class App {
  #planets;
  #bool = false;

  constructor() {
    this._loadAPI();

    btnSearch.addEventListener('click', this._searchAPI.bind(this));
    btnChange.addEventListener('click', this._changeOrder.bind(this));
    btnReset.addEventListener('click', this._resetAPI.bind(this));
  }

  async _loadAPI() {
    const res = await fetch('https://swapi.dev/api/planets');
    const data = await res.json();
    this.#planets = data.results;

    this._render(this.#planets, container);
    container.classList.add('visible');
  }

  _render(what, where) {
    container.innerHTML = '';

    what.forEach(planet => {
      const data = planet.created.slice(0, 10).split('-').reverse().join('-');
      const ora = planet.created.slice(11, 16);
      const formatted = `${data} ${ora}`;

      // fai un clone del <template>
      const clone = box.content.cloneNode(true);
      const [boxChild] = clone.children;
      const [...childInfo] = boxChild.children; // mostrami i figli di .box
      const [info] = childInfo.filter(node => node.classList.contains('info')); // tra i figli dammi solo .info
      const [place, create] = info.children; // destrutturazione per prendere i valori  da sovrascrivere
      place.innerText = planet.name;
      create.innerText = formatted;
      where.appendChild(clone); // infine ignetta il clone in pagina
    });
  }

  _searchAPI(e) {
    e.preventDefault();

    // se si clicca su un bottone e se il bottone ha come valore search
    // svuota la sezione richiesta e riempila con i dati filtrati provenienti dall'API
    if (from.value !== '' && to.value !== '') {
      // Filtro che prende 3 input (date)
      this.#planets = this.#planets.filter(planet => {
        // li converte in millesecondi
        const dataFrom = new Date(`${from.value} 00:00`).getTime();
        const dataTo = new Date(`${to.value} 23:59:59`).getTime();
        const curData = new Date(planet.created).getTime();

        // e ritorna solo le date che si trovano tra l'input data di partenza e quello di fine
        return dataFrom <= curData && dataTo >= curData;
      });

      this._render(this.#planets, container);
    }
  }

  _changeOrder(e) {
    e.preventDefault();

    this.#bool = !this.#bool;
    sort.innerText = this.#bool ? '↑' : '↓';

    // Viene stampato a schermo un array in ordine ascendente o discendente in base al click
    this._render(this._sorting(this.#planets), container);
  }

  _resetAPI(e) {
    e.preventDefault();
    if (from.value !== '' && to.value !== '') {
      // Reset
      from.value = '';
      to.value = '';
      container.classList.remove('visible');
      this._loadAPI();
    }
  }

  _sorting(what) {
    return what.sort((a, b) => {
      const val1 = new Date(a.created).getTime();
      const val2 = new Date(b.created).getTime();

      return val1 + val2;
    });
  }
}

const app = new App();
