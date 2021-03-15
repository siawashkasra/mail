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
  // Clear mailbox content before switching to next mailbox
    clear_DOM()
    
  fetch('/emails/' + mailbox)
  
    .then(response => response.json())
    .then(email => {

        if(email && email.length > 0) {

          for(let i = 0; i < email.length; i ++) {
            create_email_view(email[i]);
          }
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

  event.preventDefault();

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
  });
  
}

function create_email_view(email){

  const div = document.createElement("div")
  div.classList.add("row")
  div.classList.add("email-item")
  div.classList.add("my-3")
  div.classList.add("p-3")
  div.classList.add("bg-body")
  div.classList.add("rounded")
  div.classList.add("shadow-sm")

  const first_div = document.createElement("div")
  first_div.classList.add("col-lg-4")

  const second_div = document.createElement("div")
  second_div.classList.add("col-lg-4")

  const third_div = document.createElement("div")
  third_div.setAttribute("style", "text-align:end")
  third_div.classList.add("col-lg-4")


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

  const header = document.createElement("h6")
  header.textContent=email.subject + " <" + email.sender + ">"

  const timestamp = document.createElement("h6")
  timestamp.textContent=email.timestamp
  
  const p = document.createElement("p")
  p.classList.add("pb-3")
  p.classList.add("mb-0")
  p.classList.add("small")

  const btn = document.createElement("span")
  btn.classList.add("badge")
  btn.classList.add("bg-danger")
  btn.textContent='Archive'
 
  const span = document.createElement("span")
  span.innerHTML=email.body
  p.appendChild(span)

  // Create inner div
  const div_row = document.createElement("div")
  div_row.classList.add("row")
  
  const col_1 = document.createElement("div")
  col_1.classList.add("col-lg-9")

  const col_2 = document.createElement("div")
  col_2.classList.add("col-lg-3")

  col_1.appendChild(header)
  col_2.appendChild(btn)
  div_row.appendChild(col_1)
  div_row.appendChild(col_2)
  first_div.appendChild(div_row)
  
  div.appendChild(first_div)
  second_div.appendChild(p)
  div.appendChild(second_div)
  third_div.appendChild(timestamp)
  div.appendChild(third_div)

  target = document.querySelector(".target")
  
  target.after(div)

}


function clear_DOM() {

  if(document.contains(document.querySelector(".row"))) {
    
    emails = document.querySelectorAll(".row")

      emails.forEach(element => {

        element.remove()

      });
    }
      
  }




