document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);
  document.querySelector('#compose-form').addEventListener('submit', send_email);

  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function load_mailbox(mailbox) {

  fetch('/emails/' + mailbox)
  
    .then(response => response.json())
    .then(email => {

        for(let i = 0; i < email.length; i ++) {
            create_email_view(email[i]);
        }
        console.log(email);

});
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('.mail_box').innerHTML = mailbox.charAt(0).toUpperCase() + mailbox.slice(1);
}

function send_email(event) {
  
  fetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
      
        recipients: document.querySelector("#compose-recipients").value,
        subject: document.querySelector("#compose-subject").value,
        body: document.querySelector('#compose-body').value
    })
  })

  .then(response => response.json())
  .then(result => {
      // Print result
      if (result.success) {
        load_mailbox('sent');
      }

      console.log(result);
  });

  event.preventDefault();
  
}


function load_inbox() {
  
}


function create_email_view(email){

  const div = document.createElement("div")
  div.classList.add("d-flex")
  div.classList.add("text-muted")
  div.classList.add("pt-3")

  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.classList.add("bd-placeholder-img")
  svg.classList.add("flex-shrink-0")
  svg.classList.add("me-2")
  svg.classList.add("rounded")
  svg.setAttribute('width', 32)
  svg.setAttribute("height", 32)
  svg.setAttribute("xmlns", "http://www.w3.org/2000/svg")
  svg.setAttribute("role", "img")
  svg.setAttribute("aria-label", "Placeholder: 32x32")
  svg.setAttribute("preserveAspectRatio", "xMidYMid slice")
  svg.setAttribute("focusable", false)

  const title= document.createElement("title")
  title.innerHTML = "Placeholder"
  svg.appendChild(title)

  const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  rect.setAttribute("width", "100%")
  rect.setAttribute("height", "100%")
  rect.setAttribute("fill", "#007bff")
  svg.appendChild(rect)

  const text = document.createElement("text")
  text.setAttribute('x', "50%")
  text.setAttribute("y", "50%")
  text.setAttribute("fill", "#007bff")
  text.setAttribute("dy", ".3em")
  text.innerHTML = "32x32"
  svg.appendChild(text)


  const p = document.createElement("p")
  p.classList.add("pb-3")
  p.classList.add("mb-0")
  p.classList.add("small")
  p.classList.add("border-bottom")

  const strong = document.createElement("strong")
  strong.classList.add("d-block")
  strong.classList.add("text-gray-dark")
  strong.innerHTML=email.sender
  p.appendChild(strong)
  const span = document.createElement("span")
  span.innerHTML=email.body
  p.appendChild(span)

  div.appendChild(p)

  div.appendChild(svg)
  div.appendChild(p)

  target = document.querySelector(".target")
  
  target.after(div)

}

