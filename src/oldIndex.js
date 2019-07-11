function getTimeInHours(timeInMin) {
  if (!timeInMin) {
    return '--';
  }
  return (Math.floor(timeInMin / 60) || 0) + 'h ' + timeInMin % 60 + 'min ';
}

function cutOverview(text) {
  if (text.length > 50) {
    text = text.substring(0, 50) + '...';
  }
  return text;
}

function createCard(item) {
  const genres = item.genres.join(', ');
  const time = getTimeInHours(item.runtime);
  const overview = cutOverview(item.overview);
  return '<div class="content__item">'
            + '<img src="' + item.poster_path + '" />'
            + '<div class="item-description">'
              + '<div class="item-title"><h2>' + item.title + '</h2><p>' + item.tagline + '</p></div>'
              + '<div class="item-info"><h3>Genre: </h3><p>' + genres + '</p></div>'
              + '<div class="item-info"><h3>Time: </h3><p>' + time + '</p></div>'
              + '<div class="item-info"><h3>Rating: </h3><p>' + item.vote_average + ' (Votes: ' + item.vote_count + ')</p></div>'
              + '<div class="item-info description-short"><h3>Description: </h3><p>' + overview + '<span class="read-more" id="' + item.id + '">>> read more</span></p></div>'
              + '<div class="item-info description-full"><h3>Description: </h3><p>' + item.overview + '<span class="read-more" id="' + item.id + '"><< read less</span></p></div>'
            + '</div>'
          + '</div>';
}

function createModal(item) {
  const genres = item.genres.join(', ');
  const time = getTimeInHours(item.runtime);
  return '<div class="wrapper__modal" id="' + item.id + '">'
          + '<div class="content__modal">'
            + '<div class="close-modal"><span>x</span></div>'
            + '<div class="modal">'
              + '<img src="' + item.poster_path + '" />'
              + '<div class="item-description">'
                + '<div class="item-info"><div class="item-title"><h2>' + item.title + '</h2><p>' + item.tagline + '</p></div></div>'
                + '<div class="item-info"><h3>Genre: </h3><p>' + genres + '</p></div>'
                + '<div class="item-info"><h3>Time: </h3><p>' + time + '</p></div>'
                + '<div class="item-info"><h3>Rating: </h3><p>' + item.vote_average + ' (Votes: ' + item.vote_count + ')</p></div>'
                + '<div class="item-info"><h3>Description: </h3><p>' + item.overview + '</p></div>'
              + '</div>'
            + '</div>'
          + '</div>'
        + '</div>';
}

function renderItems(itemsList, insertPlace) {
  if ($('#content').contents().length === 0) {
    $('#content').append('<div class="cover"></div><div class="cards-list"></div><div class="modals-list"></div>');
  }

  itemsList = itemsList.join('');
  $(itemsList).appendTo(insertPlace);
}

function openModal(e) {
  if ($('body').innerWidth() > '450') {
    let cardId = '#' + e.target.id + '.wrapper__modal';

    $('body').addClass('lock');
    $('.cover').fadeIn(400);
    
    $(cardId)
    .addClass('show')
    .fadeIn(400);
  } else {
    console.log('cardId ', ('#' + e.target.id));
    //console.log('cardId ', $(cardId).find('.description-short'));
    // $(cardId).find('.description-short').hide();
    // $(cardId).find('.description-full').show();
  }
}

function closeModal() {
  if ($('body').innerWidth() > '450') {
    $('body').removeClass('lock');
    $('.cover').fadeOut(400);
    $('.show').fadeOut(400).removeClass('show');
  }
  // else {
  //   $('.description-full').hide();
  //   $('.description-short').show();
  // }
}

function ajaxRequest(data) {
  $.ajax({
    url: data.url,
    dataType: 'json',
    data: { offset: data.offset },
    beforeSend: function() { data.inProgress = true; },
    context: {
      data: data
    },
    success: processData
  });
}

function processData(response) {
  const responseArr = response.data;
  const data = this.data;
  const cards = this.data.cards;
  const modals = this.data.modals;
  const findThis = $('#findThis').val().toLowerCase();

  data.inProgress = false;

  console.log('response ', response);
  console.log('responseArr ', responseArr);
  
  for (let i = 0; i < responseArr.length; i += 1) {
    let title = responseArr[i].title.toLowerCase();
    let description = responseArr[i].overview.toLowerCase();
    let genres = responseArr[i].genres;

    for (let i = 0; i < genres.length; i += 1) {
      genres[i] = genres[i].toLowerCase();
    }

    if (title.includes(findThis) || description.includes(findThis) || genres.includes(findThis)) {
      const card = createCard(responseArr[i]);
      const modal = createModal(responseArr[i]);
      cards.push(card);
      modals.push(modal);
    }

    if (cards.length === data.limit) {
      data.offset += i + 1;
      renderItems(cards, '.cards-list');
      renderItems(modals, '.modals-list');
      break;
    }
  }
  
  if (cards.length < data.limit) {
    data.offset += data.limit;
    ajaxRequest(data);
  }
  console.log('data.offset ', data.offset);
  
  $('.read-more').on('click', openModal);
  $('.close-modal').on('click', closeModal);
  
  $(document).on('keydown', function(e) {
    if (e.key === 'Escape') {
      closeModal();
    }
  });
}

$(function() {
  const data = {
    url: 'http://react-cdp-api.herokuapp.com/movies/',
    offset: 0,
    limit: 12,
    cards: [],
    modals: [],
    inProgress: false
  };
  
  $('#form')
    .append('<input id="findThis" type="text" name="findThis">')
    .append('<input type="submit" value="Search">')
    .submit(function(e) {
      e.preventDefault();
      $('#content').empty();
      data.cards = [];
      data.modals = [];
      data.offset = 0;
      ajaxRequest(data);
    });

  $(window)
    .scroll(function() {
      if ($(window).scrollTop() + $(window).height() >= $(document).height() - 20 && !data.inProgress) {
        data.cards = [];
        data.modals = [];
        ajaxRequest(data);
      }
    });
});

// https://twog.me/sokratit-tekst-jquery-readmore/
