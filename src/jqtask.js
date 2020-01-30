import $ from 'jquery';

const silverTIer = 15;
const bronzeTier = 5;
let goldList = [];
let silverList = [];
let bronzeList = [];
let list = [];
function getContributors(owner, repo) {
  return $.ajax({
    dataType: 'json',
    type: 'GET',
    url: `https://api.github.com/repos/${owner}/${repo}/contributors`,
  });
}

function getInfo(user) {
  return $.ajax({
    dataType: 'json',
    type: 'GET',
    url: `https://api.github.com/users/${user}`,
  });
}

function ascSort(array) {
  array.forEach((arr) => {
    for (let i = 0, endI = arr.length - 1; i < endI; i += 1) {
      for (let j = 0, endJ = endI - i; j < endJ; j += 1) {
        if (arr[j].login[0].toLowerCase() < arr[j + 1].login[0].toLowerCase()) {
          const swap = arr[j];
          arr[j] = arr[j + 1];
          arr[j + 1] = swap;
        }
      }
    }
  });
}

function descSort(array) {
  array.forEach((arr) => {
    for (let i = 0, endI = arr.length - 1; i < endI; i += 1) {
      for (let j = 0, endJ = endI - i; j < endJ; j += 1) {
        if (arr[j].login[0].toLowerCase() > arr[j + 1].login[0].toLowerCase()) {
          const swap = arr[j];
          arr[j] = arr[j + 1];
          arr[j + 1] = swap;
        }
      }
    }
  });
}

function contrASort(array) {
  array.forEach((arr) => {
    for (let i = 0, endI = arr.length - 1; i < endI; i += 1) {
      for (let j = 0, endJ = endI - i; j < endJ; j += 1) {
        if (arr[j].contributions > arr[j + 1].contributions) {
          const swap = arr[j];
          arr[j] = arr[j + 1];
          arr[j + 1] = swap;
        }
      }
    }
  });
}

function contrDSort(array) {
  array.forEach((arr) => {
    for (let i = 0, endI = arr.length - 1; i < endI; i += 1) {
      for (let j = 0, endJ = endI - i; j < endJ; j += 1) {
        if (arr[j].contributions < arr[j + 1].contributions) {
          const swap = arr[j];
          arr[j] = arr[j + 1];
          arr[j + 1] = swap;
        }
      }
    }
  });
}

function replace(arr) {
  $('.list_content').empty();
  arr.forEach((element) => {
    getInfo(element.login).then((content) => {
      $('.list_content').append(
        `<div class = "list_item"><span class = "item_login"><a href = "${element.html_url}">${element.login}</a></span>
        <br>
        <span class = "item_company">Company: ${content.company}</span>
        <br>
        <span class = "item_email">Email: ${content.email}</span>
        <br>
        <span class = "item_location">Location: ${content.location}</span>
        <br>
        <button id = "editProfile" class = "click-me">edit profile</button>
        </div>`,
      );
    });
  });
}

function sortAndReplace() {
  if ($('.sort-type:selected').attr('data-val') === 'alph_a') {
    ascSort([list, goldList, bronzeList, silverList]);
    if ($('.list_content').attr('data-current') === 'all') {
      replace(list);
    } else if ($('.list_content').attr('data-current') === 'gold') {
      replace(goldList);
    } else if ($('.list_content').attr('data-current') === 'silver') {
      replace(silverList);
    } else if ($('.list_content').attr('data-current') === 'bronze') {
      replace(bronzeList);
    }
  } else if ($('.sort-type:selected').attr('data-val') === 'alph_d') {
    descSort([list, goldList, bronzeList, silverList]);
    if ($('.list_content').attr('data-current') === 'all') {
      replace(list);
    } else if ($('.list_content').attr('data-current') === 'gold') {
      replace(goldList);
    } else if ($('.list_content').attr('data-current') === 'silver') {
      replace(silverList);
    } else if ($('.list_content').attr('data-current') === 'bronze') {
      replace(bronzeList);
    }
  } else if ($('.sort-type:selected').attr('data-val') === 'contr_a') {
    contrASort([list, goldList, bronzeList, silverList]);
    if ($('.list_content').attr('data-current') === 'all') {
      replace(list);
    } else if ($('.list_content').attr('data-current') === 'gold') {
      replace(goldList);
    } else if ($('.list_content').attr('data-current') === 'silver') {
      replace(silverList);
    } else if ($('.list_content').attr('data-current') === 'bronze') {
      replace(bronzeList);
    }
  } else if ($('.sort-type:selected').attr('data-val') === 'contr_d') {
    contrDSort([list, goldList, bronzeList, silverList]);
    if ($('.list_content').attr('data-current') === 'all') {
      replace(list);
    } else if ($('.list_content').attr('data-current') === 'gold') {
      replace(goldList);
    } else if ($('.list_content').attr('data-current') === 'silver') {
      replace(silverList);
    } else if ($('.list_content').attr('data-current') === 'bronze') {
      replace(bronzeList);
    }
  }
}

$(document).ready(() => {
  $.ajax({
    url: 'https://api.github.com/rate_limit',
    success(data) {
      console.log(data);
    },
  });
  $('#inputButton').click(() => {
    list = [];
    goldList = [];
    bronzeList = [];
    silverList = [];
    $('.list_content').empty();
    const requestParams = $('#inputText')
      .val()
      .split('/');
    getContributors(requestParams[0], requestParams[1]).then((content) => {
      content.forEach((element) => {
        list.push(element);
        if (element.contributions <= bronzeTier) {
          bronzeList.push(element);
        } else if (element.contributions <= silverTIer) {
          silverList.push(element);
        } else {
          goldList.push(element);
        }
      });
      $('.all-tier').trigger('click');
    }),
    (errData) => {
      console.log(`${errData.status} ${errData.statusText}`);
    };
  });
  $('.all-tier').click(() => {
    $('.list_content').attr('data-current', 'all');
    replace(list);
  });
  $('.gold-tier').click(() => {
    $('.list_content').attr('data-current', 'gold');
    replace(goldList);
  });
  $('.silver-tier').click(() => {
    $('.list_content').attr('data-current', 'silver');
    replace(silverList);
  });
  $('.bronze-tier').click(() => {
    $('.list_content').attr('data-current', 'bronze');
    replace(bronzeList);
  });
  $('.sort_main').on('change', () => {
    sortAndReplace();
  });
});

