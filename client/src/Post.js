import { formatISO9075} from "date-fns";
export default function Post({title,summary,cover,content,createdAt}) {

    return (

        <div className="post">
        <div className="image">
        <img src="https://miro.medium.com/v2/resize:fit:1400/format:webp/1*MkTATpXA24eEQAQVcPYvQQ.jpeg" alt="" />
          </div>
  
   <div className="texts">
    <h2>{title}</h2>
    <p className="info"> 
    <a className="author">James Ethan </a>
    <time> {formatISO9075(new Date (createdAt))} </time>
    </p> 
    <p className="summary"> {summary}</p>
   </div>
      </div>

    );
}