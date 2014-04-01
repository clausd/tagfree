Append to topbar, which is 
'global-nav'
or 
'global-nav-inner' <-- best choice...
$('.global-nav-inner').append("some html that will be the new control box")
$('.global-nav-inner').height(92)

3 visibility levels
none
capped
all

"toggle"
click cycle through capped => none => all => capped

2 global controls
hide everything/show everything
  hide everything => all tags go to 'none'
  show everything => all tags to 'all'
hide all tags/show all tags
  hide all tags => all tags go to 'none'
  show all tags => all tags to 'all'

style tags: none => italics
            all => bold
            capped => no style


display logic:
  
  if hide_everything
    hide everything except tags not set to 'none'
  if hide tags
    just respect tag hidings
  
  
tweets are in 
.content class

textindhold $('.content-main .content ').not('.seen').find('.tweet-text').first().text()

textindhold netop fra dem man ikke har mærket med
addClass('seen')

pc = $('#page-container').first()
// flyt containeren ned, så tools i topbaren ikke støder imod
$(pc).css('padding-top', '102px')


function checkElements() {
  $('.content-main .content').not('.seen').each(function (i,elem) {
    console.log($(elem).find('.tweet-text').first().text());
    $(elem).append("<div>checked</div>")
    $(elem).addClass('seen')
  });
  window.setTimeout(function() {checkElements()}, 1000);
}

