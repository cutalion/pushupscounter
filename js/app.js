class App {
  constructor(dbName, total, step) {
    this.db = new PouchDB(dbName);
    this.defaultTotal = total;
    this.defaultStep = step;

    this.setDefault('total', total);
    this.setDefault('step', step);
  }


  setDefault(id, val) {
    this.db.get(id).then(doc => {
      console.log(id, doc.value)
    }).catch(err => {
      if (err.status == 404) {
        console.log('DB has no id', id);

        this.db.put({ _id: id, value: val })
          .then(doc => console.log('Default', id, 'is set to', val))
          .catch(err => { console.log('setDefault error', err) });
      } else {
        console.log('Error', err);
      }
    });
  }

  async total() {
    return await this.get('total', this.defaultTotal);
  }

  async step() {
    return await this.get('step', this.defaultStep);
  }

  async get(id, defaultValue) {
    return await this.db.get(id)
      .then((doc) => { return doc.value })
      .catch(() => { return defaultValue });
  }

  async add(n) {
    if (isNaN(n)) { return; }

    await this.db.get('total').then(doc => {
      this.db.put({ _id: 'total', _rev: doc._rev, value: doc.value + n });
    })
  }

  async subtract(n) {
    if (isNaN(n)) { return; }

    await this.db.get('total').then(doc => {
      let total = doc.value;

      if (total > n) {
        total -= n;
      } else {
        total = 0;
      }

      this.db.put({ _id: 'total', _rev: doc._rev, value: total });
    })
  }

  async updateStep(step) {
    if (isNaN(step)) { return; }

    await this.db.get('step').then(doc => {
      this.db.put({ _id: 'step', _rev: doc._rev, value: step });
    })
  }
}

if (!window.indexedDB) {
  console.log("Your browser doesn't support a stable version of IndexedDB. Storing data between session will not work");
}

if('serviceWorker' in navigator) {
  console.log('serviceWorker available');
  navigator.serviceWorker.register('/pushupscounter/sw.js');
  console.log('serviceWorker registered');
} else {
  console.log('serviceWorker is not supported');
}

document.addEventListener('DOMContentLoaded', (e) => {
  let counter = document.getElementById('counter');
  let count   = document.getElementById('count');
  let plus    = document.getElementById('plus');
  let minus   = document.getElementById('minus');

  let app = new App('pushupscounter', 0, 1);

  let updateCounter = () => {
    app.total().then(total => {
      counter.innerText = total;
    });
  };

  let updateStep = () => {
    app.step().then(step => {
      count.value = step;
    });
  };

  plus.addEventListener('click', (e) => {
    let amount = parseInt(count.value);
    app.add(amount).then(() => updateCounter());
  })

  minus.addEventListener('click', (e) => {
    let amount = parseInt(count.value)
    app.subtract(amount).then(() => updateCounter());
  })

  count.addEventListener('input', (e) => {
    let step = parseInt(count.value);
    app.updateStep(step);
  })

  updateCounter();
  updateStep();
});
