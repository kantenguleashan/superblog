export default function Post() {

    return (

        <div className="post">
        <div className="image">
        <img src="https://miro.medium.com/v2/resize:fit:1400/format:webp/1*MkTATpXA24eEQAQVcPYvQQ.jpeg" alt="" />
          </div>
  
   <div className="texts">
    <h2> Ai Copiloting </h2>
    <p className="info"> 
    <a className="author"> James Ethan</a> 
    <time> 2024-01-06 16:00 </time>
    </p> 
    <p className="summary">f you’re anything like me, you might have dismissed some of the new AI tooling as gimmicky. But since the recent announcement that GitHub Copilot is now free, I thought I’d give it a proper go — and boy am I glad I did! It’s so much more than glorified autocomplete; it’s become an integral part of my workflow and I’m not looking back anytime soon.</p>
   </div>
      </div>

    );
}