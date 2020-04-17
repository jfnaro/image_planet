
// wait until the base HTML is loaded
document.addEventListener('DOMContentLoaded', function () {
    
    // get needed elements
    const recentContainer = document.querySelector('div.recent-image-container');
    
    // create socket
    let socket = io();

    // join general notification room
    socket.emit('join-general-room');

    // handle new images. append to top of recent images
    socket.on('new-image-full', function (data) { 
    
      // handle the no image case
      const noImage = document.querySelectorAll('.recent-image-container p.no-recent-images');
      if (noImage.length > 0) {
        noImage.outerHTML = data.html;
      }
      else
      {
        let newImageContainer = document.createElement("div");
        recentContainer.insertBefore(newImageContainer, recentContainer.childNodes[3]);
        newImageContainer.outerHTML = data.html;
      }
      
      // now set up the AJAX handlers
      const likeBtn = document.querySelector('#user-' + data.userid + '-img-' + data.imageid + ' button.like-btn');
      const commentSubmit = document.querySelector('#user-' + data.userid + '-img-' + data.imageid + ' input.submit-comment-btn');
      likeBtn.onclick = likeClick;
      commentSubmit.onclick = comClick;
      
    });
    
    // handle new comments. append to bottom of comment container
    socket.on('new-comment-full', function (data) { 
    
      // try to find the appropriate comment div
      commentContainerCSSID = '#com-block-' + data.imageid;
      const commentContainer = document.querySelector(commentContainerCSSID);
      
      if (commentContainer)
      {
        // check if there are no comments and handle appropriately
        const commentBlocks = document.querySelectorAll(commentContainerCSSID + ' div.comment-block')
        if (commentBlocks.length > 0) {
          let newCommentBlock = document.createElement("div");
          commentContainer.appendChild(newCommentBlock);
          newCommentBlock.outerHTML = data.html;
        }
        else
        {
          commentContainer.innerHTML = data.html;
        }
      }
        
    });
    
    // handle new likes. increment the appropriate like count
    socket.on('new-like', function (data) { 
    
      // try to find the appropriate like button
      const likeBtn = document.querySelector('#like-' + data.imageid);
      
      if (likeBtn)
      {
        let likeText = likeBtn.innerHTML;
        let firstParen = likeText.lastIndexOf('(');
        let secondParen = likeText.lastIndexOf(')');
        let likeCount = parseInt(likeText.slice(firstParen + 1, secondParen));
        likeBtn.innerHTML = 'Like This Image! (' + ((likeCount + 1).toString()) + ')';
      }
        
    });
    
});
