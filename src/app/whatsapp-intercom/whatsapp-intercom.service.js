export class commService {
  constructor() {
    'ngInject';

    this.url = '';
    this.allData;

  }

  fetch_data(cb) {
    const url = "http://temp.dash.zeta.in/food.php";
    fetch(url)
      .then(response => response.json())
      .then(recipes => cb(recipes));
  }

   getAllRecipes() {
    return this.allData;
  }

}
