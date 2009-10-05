<?php
require_once('../../config.inc');
$_META['page_title'] = 'labs';
$doc = new HTDoc($_META['lang'], $_META['charset'], $_META['org'], $_META['domain'], $_META['base_title'], $_META['author'], $_META['page_title'], $_META['description'], $_META['keywords'], $_META['category'], $_META['title_separator']);
$doc->doctype();
$doc->add_profile(array('grddl','hcard','rel-license','rel-tag','3am-xmdp'));
$doc->add_meta(array('main','dc','dmoz','geo','tgn','icbm','icra','foaf','cc','xmdp','nav','favicon','rss','atom','grddl','sitemap'));
$doc->add_style('http://3amproductions.net/styles/main.css','screen,projection');
$doc->add_style('http://3amproductions.net/styles/ie.css','screen,projection',null,null,'IE');
$doc->add_style('http://3amproductions.net/styles/print.css','print');
$doc->add_style('http://3amproductions.net/styles/handheld.css','handheld');
$doc->script->set_dir('../../../3amproductions.net/scripts/');
$doc->add_script('footnotelinks.js');
$doc->head();
?>
<body>
<div id="container">

<div id="header">
<h1 id="vcard-3am" class="vcard"><span class="fn org"><span id="orgname" class="organization-name">3AM Productions</span></span> ||| <span id="note" class="note">We Make Websites</span><a class="include" href="#logo"></a></h1>
<!-- <a href="#" class="link">en espa<?=$_ENT['n-tilde']?>ol</a> -->
</div><!-- header -->

<ul id="nav" title="Main Navigation">
	<li id="skipnav"><a href="#content" title="Skip Navigation">Skip to Content</a></li>
    <li><a href="http://3amproductions.net/index" title="go to our homepage" rel="self">Home</a></li>
    <li><a href="/index" class="active" title="see what we're cooking up" rel="self">Labs</a></li>
	<li><a href="http://3amproductions.net/approach" title="follow our web development procedure" rel="next" rev="home">Procedure</a></li>
	<li><a href="http://3amproductions.net/about" title="learn more about 3AM" rel="about" rev="home">About</a></li>
	<li><a href="http://3amproductions.net/portfolio" title="see some of our previous work" rev="home">Portfolio</a></li>
	<li><a href="http://3amproductions.net/contact" title="get in touch with us" rel="contact" rev="home">Contact</a></li>
</ul>
<div id="content">

<div id="leftcolumn">
<?=$_naked?>
<h2>jQuery.Firebug</h2>

<p>Announcing jQuery.Firebug! This is a jQuery plugin to add the Firebug console methods to the jQuery object. 
The current API supports the entire <a href="http://getfirebug.com/console.html">Firebug 1.2 console API</a>, 
which consists of <samp>log</samp>, <samp>debug</samp>, <samp>info</samp>, <samp>warn</samp>, <samp>error</samp>, 
<samp>assert</samp>, <samp>dir</samp>, <samp>dirxml</samp>, <samp>trace</samp>, <samp>group</samp>, <samp>groupEnd</samp>, 
<samp>time</samp>, <samp>timeEnd</samp>, <samp>profile</samp>, <samp>profileEnd</samp>, and <samp>count</samp>. 
In addition, all methods are fully chainable and will return the jQuery object (unmodified) on which they were invoked.</p>

<p>Usage of the API should be intuitive for those who have used Firebug's console API before, with one rather significant wrinkle. 
Whereas logging to the console was normally accomplished using <samp>console.log(parameters)</samp>, 
the jQuery methods will get their 'parameters' not only from the methods' parameters themselves, 
but also from the jQuery object itself. (more on this later)
I believe this is desired functionality, as the itch I intended to scratch always involved inspecting the 
jQuery object itself at some point(s) in a call chain.
For instance, let's use this rather long jQuery call chain, despite the fact that chains this long quickly 
become a maintenance problem. (Although chaining is one of jQuery's greatest strengths).</p>

<code class="javascript">
var sameName = $("input[name=targetName]");
//* set class of label to match input's checked status
sameName
    .not(":checked")
    .parents("label")
    .removeClass("checked")
    .end()
    .end()
    .filter(":checked")
    .parents("label")
    .addClass("checked")
    .end();//*/
</code>

<p>This is rather long jQuery chain selects all input elements with the name attribute of <samp>targetName</samp>.
The first three jQuery methods remove the class <samp>checked</samp> from <samp>label</samp> elements that are parents 
of unchecked input elements from our original set.
The two <samp>end()</samp> methods restore our original set where we perform the opposite:
Add the class <samp>checked</samp> to <samp>label</samp> elements that are parents of checked input elements from the original set.</p>

<p>Suppose we wished to inspect the jQuery object at various points in this call chain. 
We would have to create a temporary variable to store the jQuery object, call <samp>console.debug</samp> 
(or some other console method), and then proceed with the call chain.</p>

<code class="javascript">
var temp1 = sameName.not(":checked");
console.debug(temp1);
var temp2 = temp1.parents("label");
console.debug(temp2);
var temp3 = temp2.removeClass("checked").end().end().filter(":checked");
console.debug(temp3);
var temp4 = temp3.parents("label");
console.debug(temp4);
sameName = temp4.addClass("checked").end();//*/
</code>

<p>With jQuery.Firebug the same could be accomplished with:</p>

<code class="javascript">
sameName
    .not(":checked").debug()
    .parents("label").debug()
    .removeClass("checked")
    .end()
    .end()
    .filter(":checked").debug()
    .parents("label").debug()
    .addClass("checked")
    .end();//*/
</code>

<p>Notice the four <samp>.debug()</samp> method calls? With the chaining power of jQuery we can add the debugging power 
of Firebug to our jQuery objects anywhere in the chain we wish, without altering the effects of the entire call. 
This is because the Firebug methods return the same, unmodified jQuery object on which they are invoked, 
so you can continue on with your call chain!</p>

<p>Now, about the wrinkle I mentioned earlier... When a Firebug method is called, the same method is invoked on each 
element of the current jQuery object. 
To improve the readibility of the Firebug console, these are grouped using the Firebug <samp>group()</samp> method. 
In this way, each jQuery object is output to the console as a group consisting of the elements it contains. 
Further, any parameters passed to the method {eg: <samp>jQueryObject.debug("param1", obj2)</samp>} 
are simply passed along to the <samp>group()</samp> method {eg: <samp>group("param1", obj2)</samp>}. 
Firebug supports nested groups, so you can even group your own debug calls!</p>

<p>For use in browsers that do not support Firebug, jQuery.Firebug will attemp to load FirebugLite. 
More information on this coming soon.</p>

<p>Debugging may also be turned off by setting the global variable <var>DEBUG</var> to false. (eg: <samp>window.DEBUG = false</samp>)</p>

<p>Known conflicts: <acronym title="Internet Explorer">IE</acronym> with Companion.JS</p>

<p>jQuery.Firebug has been tested using jQuery 1.2.3 with Opera 9, Firefox 2 (with and without Firebug), Firefox 3 (with and without Firebug), 
and <acronym title="Internet Explorer">IE</acronym>7 (with and without <acronym title="Internet Explorer">IE</acronym> Developer Toolbar).</p>

<p>jQuery.Firebug was inspired by <a href="http://jquery.glyphix.com/">jQuery.debug</a> by <a href="http://glyphix.com/glyphix.html">Glyphix</a> and
Ralf S. Engelschall's <a href="http://trainofthoughts.org/blog/2007/03/16/jquery-plugin-debug/">jQuery debugging plugin</a> from 
<a href="http://trainofthoughts.org/blog/">Train of Thoughts</a></p>
</div><!-- leftcolumn -->

<div>
</div><!-- rightcolumn -->

<div id="footer"><?=$_footer?></div><!-- footer -->
</div><!-- content -->
</div><!-- container -->
<?=$_analytics?>
</body>
</html>