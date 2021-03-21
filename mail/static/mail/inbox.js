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
    document.querySelector(".target").style.display = 'block'
  fetch('/emails/' + mailbox)
  
    .then(response => response.json())
    .then(email => {

        if(email && email.length > 0) {
          for(let i = 0; i < email.length; i ++) {
            create_email_view(email[i], mailbox);
          }
        }
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

  .then(response => {

    if(response.status == 201 | response.status == 200) {
      load_mailbox("sent")
      document.querySelector(".alert-success").style.display ='block'
    }

    else if(response.status == 400) {
      document.querySelector(".alert-danger").style.display ='block'
    }

  });
  
}

function create_email_view(email, mail_box){

  const div = document.createElement("div")
  div.classList.add("row")
  div.classList.add("email-item")
  div.classList.add("my-3")
  div.classList.add("p-3")
  div.classList.add("bg-body")
  div.classList.add("rounded")
  div.classList.add("shadow-sm")
  div.setAttribute("id", email.id)

  if (email.read) {

    div.classList.add("has-been-read")
  }

  div.setAttribute("onclick", "load_single_email(this.id)")

  const first_div = document.createElement("div")
  first_div.classList.add("col-lg-4")

  const second_div = document.createElement("div")
  second_div.classList.add("col-lg-4")

  const third_div = document.createElement("div")
  third_div.setAttribute("style", "text-align:end")
  third_div.classList.add("col-lg-4")

  const header = document.createElement("h6")
  header.textContent=email.subject + " <" + email.sender + ">"

  const timestamp = document.createElement("h6")
  timestamp.textContent=email.timestamp
  
  const p = document.createElement("p")
  p.classList.add("pb-3")
  p.classList.add("mb-0")
  p.classList.add("small")

  
  const btn = document.createElement("span")
  btn.classList.add("btn")
  btn.classList.add("badge")
  btn.classList.add("bg-danger")
  btn.setAttribute("id", email.id)

  if (mail_box === 'inbox') {

    btn.setAttribute("onclick", "archive_email(this.id)")
    btn.textContent='Archive'
  }

  
  if (mail_box === 'archive') {

    btn.setAttribute("onclick", "unarchive_email(this.id)")
    btn.textContent='Unarchive'
  }

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

  if (mail_box === 'inbox' | mail_box === 'archive') {

    col_2.appendChild(btn)

  }

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

    if(document.contains(document.querySelector(".single-email-view"))) {
    
      email = document.querySelector(".single-email-view")
      email.remove()
      }

    if(document.contains(document.querySelector(".alert-success"))) {
      alert = document.querySelector(".alert-success")
      alert.remove()
    }
      
  }

function archive_email(id) {
  document.querySelector(".row").removeAttribute("onclick")

  fetch('/emails/' + id.toString(), {
    method: 'PUT',
    body: JSON.stringify({
        archived: true
    })
  })

  .then(response => {

    load_mailbox("inbox")
  })
}


function unarchive_email(id) {
  document.querySelector(".row").removeAttribute("onclick")

  fetch('/emails/' + id.toString(), {
    method: 'PUT',
    body: JSON.stringify({
        archived: false
    })
  })

  .then(response => {

    load_mailbox("archive")
  })
}


function read_email(id) {

  fetch('/emails/' + id.toString(), {
    method: 'PUT',
    body: JSON.stringify({
        read: true
    })
  })
}


function unread_email(id) {

  fetch('/emails/' + id.toString(), {
    method: 'PUT',
    body: JSON.stringify({
        read: false
    })
  })

  .then(response => {

    load_mailbox("inbox")
  })
}


function load_single_email(id) {

  fetch('/emails/' + id.toString())
  
    .then(response => response.json())
    .then(email => {

      create_single_email_view(email)
      
});

}
  
function create_single_email_view(email) {

  clear_DOM()

  const div = document.createElement("div")
  div.classList.add("single-email-view")

  div_row = document.createElement("div")
  div_row.classList.add("row")

  const col_1 = document.createElement("div")
  col_1.classList.add("col-lg-9")

  const col_2 = document.createElement("div")
  col_2.classList.add("col-lg-3")
  
  const subject = document.createElement("h4")
  subject.classList.add("subject")
  subject.textContent = email.subject

  const btn = document.createElement("span")
  btn.classList.add("btn")
  btn.classList.add("badge")
  btn.classList.add("bg-warning")
  btn.setAttribute("id", email.id)
  btn.setAttribute("onclick", "unread_email(this.id)")
  btn.textContent='Mark as unread'

  col_1.appendChild(subject)

  if(document.querySelector(".mail_box").textContent === 'Inbox') {
    col_2.appendChild(btn)

  }
  
  div_row.appendChild(col_1)
  div_row.appendChild(col_2)

  const from = document.createElement("h5")
  from.classList.add("from")
  from.textContent = email.sender

  const to = document.createElement("h6")
  to.classList.add("to")
  to.textContent = email.recipients

  const timestamp = document.createElement("h6")
  timestamp.classList.add("timestamp")
  timestamp.textContent = email.timestamp

  const hr = document.createElement("hr")


  div_row_2 = document.createElement("div")
  div_row_2.classList.add("row")

  const col_2_1 = document.createElement("div")
  col_2_1.classList.add("col-lg-9")

  const col_2_2 = document.createElement("div")
  col_2_2.classList.add("col-lg-3")

  const body = document.createElement("p")
  body.textContent = email.body

  col_2_1.appendChild(body)


  const reply = document.createElement("span")
  reply.classList.add("btn")
  reply.classList.add("badge")
  reply.classList.add("bg-success")
  reply.setAttribute("id", email.id)
  reply.setAttribute("onclick", "reply_email(this.id)")
  reply.textContent='Reply'

  if(document.querySelector(".mail_box").textContent === 'Inbox') {
    col_2_2.appendChild(reply)

  }
  div_row_2.appendChild(col_2_1)
  div_row_2.appendChild(col_2_2)

  div.appendChild(div_row)
  div.appendChild(from)
  div.appendChild(to)
  div.appendChild(timestamp)
  div.append(hr)
  div.appendChild(div_row_2)



  target = document.querySelector(".target")
  target.style.display = 'none'
  target.after(div)

  if(!email.read) {
    
    read_email(email.id)

  }
}

function reply_email(id) {
   // Show compose view and hide other views
   document.querySelector('#emails-view').style.display = 'none';
   document.querySelector('#compose-view').style.display = 'block';
 

   fetch('/emails/' + id.toString(), {
    method: 'GET',
  })

  .then(response => response.json())
  .then(result => {
        if (result.subject.includes('Re:')) {
          document.querySelector('#compose-subject').value = result.subject;
        }

        else {
          document.querySelector('#compose-subject').value = "Re: " + result.subject;
        }

        document.querySelector('#compose-recipients').value = result.sender;
        document.querySelector('#compose-body').value = "On " +  result.timestamp + " " + result.sender + " wrote: " + result.body
  })

}