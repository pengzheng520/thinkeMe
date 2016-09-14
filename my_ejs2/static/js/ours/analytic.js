
////////////////////////////////////////////////////////////////////////////////////////
var LMsymbols = [
//Greek letters
{input:"\\alpha",  output:"\u03B1"},
{input:"\\beta",   output:"\u03B2"},
{input:"\\gamma",  output:"\u03B3"},
{input:"\\delta",  output:"\u03B4"},
{input:"\\epsilon",  output:"\u03B5"},
{input:"\\varepsilon",   output:"\u025B"},
{input:"\\zeta",   output:"\u03B6"},
{input:"\\eta",    output:"\u03B7"},
{input:"\\theta",  output:"\u03B8"},
{input:"\\vartheta",   output:"\u03D1"},
{input:"\\iota",   output:"\u03B9"},
{input:"\\kappa",  output:"\u03BA"},
{input:"\\lambda",   output:"\u03BB"},
{input:"\\mu",     output:"\u03BC"},
{input:"\\nu",     output:"\u03BD"},
{input:"\\xi",     output:"\u03BE"},
//{input:"\\pi",     output:"\u03C0"},
{input:"\\varpi",  output:"\u03D6"},
{input:"\\rho",    output:"\u03C1"},
{input:"\\varrho",   output:"\u03F1"},
{input:"\\varsigma",   output:"\u03C2"},
{input:"\\sigma",  output:"\u03C3"},
{input:"\\tau",    output:"\u03C4"},
{input:"\\upsilon",  output:"\u03C5"},
{input:"\\phi",    output:"\u03C6"},
{input:"\\varphi",   output:"\u03D5"},
{input:"\\chi",    output:"\u03C7"},
{input:"\\psi",    output:"\u03C8"},
{input:"\\omega",  output:"\u03C9"},
{input:"\\Gamma",  output:"\u0393"},
{input:"\\Delta",  output:"\u0394"},
{input:"\\Theta",  output:"\u0398"},
{input:"\\Lambda",   output:"\u039B"},
{input:"\\Xi",     output:"\u039E"},
{input:"\\Pi",     output:"\u03A0"},
{input:"\\Sigma",  output:"\u03A3"},
{input:"\\Upsilon",  output:"\u03A5"},
{input:"\\Phi",    output:"\u03A6"},
{input:"\\Psi",    output:"\u03A8"},
{input:"\\Omega",  output:"\u03A9"},

//binary operation symbols
{input:"\\pm",     output:"\u00B1"},
{input:"\\mp",     output:"\u2213"},
{input:"\\triangleleft", output:"\u22B2"},
{input:"\\triangleright",output:"\u22B3"},
{input:"\\cdot",   output:"*"},     //乘号
{input:"\\star",   output:"\u22C6"},
{input:"\\ast",    output:"*"},    //乘号
{input:"\\times",  output:"*"},    //乘号
{input:"∗",  output:"*"},          //乘号
{input:"\\div",    output:"/"},    //除号
{input:"\\%",    output:"%"},    //除号
{input:"\\circ",   output:"\u2218"},
{input:"\\bullet",   output:"\u2022"},
{input:"\\oplus",  output:"\u2295"},//⊕
{input:"\\ominus",   output:"\u2296"},
{input:"\\otimes",   output:"\u2297"},
{input:"\\bigcirc",  output:"\u25CB"},
{input:"\\oslash",   output:"∅"},
{input:"\\odot",   output:"\u2299"},
{input:"\\land",   output:"\u2227"},
{input:"\\wedge",  output:"\u2227"},
{input:"\\lor",    output:"\u2228"},
{input:"\\vee",    output:"\u2228"},
{input:"\\cap",    output:"\u2229"},
{input:"\\cup",    output:"\u222A"},
{input:"\\sqcap",  output:"\u2293"},
{input:"\\sqcup",  output:"\u2294"},
{input:"\\uplus",  output:"\u228E"},
{input:"\\amalg",  output:"\u2210"},
{input:"\\bigtriangleup",output:"\u25B3"},
{input:"\\bigtriangledown",output:"\u25BD"},
{input:"\\ddagger",  output:"\u2021"},
{input:"\\ddag",   output:"\u2021"},
{input:"\\dagger",   output:"\u2020"},
{input:"\\dag",    output:"\u2020"},
//{input:"\\lhd",    output:"\u22B2"},   //不可用
//{input:"\\rhd",    output:"\u22B3"},   //不可用
//{input:"\\unlhd",  output:"\u22B4"},   //不可用
//{input:"\\unrhd",  output:"\u22B5"},   //不可用
{input:"\\varnothing",  output:"∅"},     //修订

//BIG Operators
{input:"\\sum",    output:"\u2211"},
{input:"\\prod",   output:"\u220F"},
{input:"\\bigcap",   output:"\u22C2"},
{input:"\\bigcup",   output:"\u22C3"},
{input:"\\bigwedge",   output:"\u22C0"},
{input:"\\bigvee",   output:"\u22C1"},
{input:"\\bigsqcap",   output:"\u2A05"},
{input:"\\bigsqcup",   output:"\u2A06"},
{input:"\\coprod",   output:"\u2210"},
{input:"\\bigoplus",   output:"\u2A01"},
{input:"\\bigotimes",  output:"\u2A02"},
{input:"\\bigodot",  output:"\u2A00"},
{input:"\\biguplus",   output:"\u2A04"},
{input:"\\oint",   output:"\u222E"},

//binary relation symbols
{input:":=",     output:":="},
{input:"\\lt",     output:"<"},
{input:"\\gt",     output:">"},
{input:"\\neq",    output:"\u2260"},
{input:"\\leqslant",   output:"\u2264"},
{input:"\\leq",    output:"\u2264"},
{input:"\\geqslant",   output:"\u2265"},
{input:"\\geq",    output:"\u2265"},
{input:"\\ge",     output:"\u2265"},
{input:"\\equiv",  output:"\u2261"},
{input:"\\ll",     output:"\u226A"},
{input:"\\gg",     output:"\u226B"},
{input:"\\doteq",  output:"\u2250"},
{input:"\\preceq",   output:"\u227C"},//次序
{input:"\\prec",   output:"\u227A"},
{input:"\\succeq",   output:"\u227D"},//次序
{input:"\\succ",   output:"\u227B"},
{input:"\\simeq",  output:"\u2243"},//次序
{input:"\\sim",    output:"\u223C"},
{input:"\\approx",   output:"\u2248"},
{input:"\\cong",   output:"\u2245"},
{input:"\\Join",   output:"\u22C8"},
{input:"\\bowtie",   output:"\u22C8"},
{input:"\\ni",     output:"\u220B"},
{input:"\\owns",   output:"\u220B"},
{input:"\\propto",   output:"\u221D"},
{input:"\\vdash",  output:"\u22A2"},
{input:"\\dashv",  output:"\u22A3"},
{input:"\\models",   output:"\u22A8"},
{input:"\\perp",   output:"\u22A5"},
{input:"\\smile",  output:"\u2323"},
{input:"\\frown",  output:"\u2322"},
{input:"\\asymp",  output:"\u224D"},
{input:"\\notin",  output:"\u2209"},
{input:"\\sqsubseteq",   output:"\u2291"},//次序
{input:"\\sqsupseteq",   output:"\u2292"},
{input:"\\sqsubset",   output:"\u228F"},
{input:"\\sqsupset",   output:"\u2290"},
{input:"\\nsubseteq",   output:"⊈"}, //新增
{input:"\\nsupseteq",   output:"⊉"}, //新增
{input:"\\not\\subseteq",   output:"⊆"}, //新增
{input:"\\not\\supseteq",   output:"⊇"}, //新增
{input:"\\subseteq",   output:"\u2286"},
{input:"\\supseteq",   output:"\u2287"},
{input:"\\subset",   output:"\u2282"},
{input:"\\supset",   output:"\u2283"},

//matrices
//{input:"\\begin{eqnarray}", output:"X"},
//{input:"\\begin{array}",  output:"X"},
//{input:"\\\\",      output:"}&{"},
//{input:"\\end{eqnarray}", output:"}}"},
//{input:"\\end{array}",    output:"}}"},

//grouping and literal brackets -- ieval is for IE
//{input:"\\Bigg",    output:"X", atval:"2.9", ieval:"3.9"},
//{input:"\\bigg",    output:"X", atval:"2.2", ieval:"3.2"},
//{input:"\\Big",     output:"X", atval:"1.6", ieval:"2.6"},
//{input:"\\big",     output:"X", atval:"1.2", ieval:"2.2"},
//{input:"{",    output:"{",  invisible:true},
//{input:"}",    output:"}"},
//{input:"(",     output:"("},
//{input:"[",     output:"["},
{input:"\\lbrack",  output:"["},
//{input:"\\{",     output:"{"},
{input:"\\lbrace",  output:"{"},
{input:"\\langle",  output:"\u2329"},
{input:"\\lfloor",  output:"\u230A"},
{input:"\\lceil",   output:"\u2308"},

// rtag:"mi" causes space to be inserted before a following sin, cos, etc.
// (see function LMparseExpr() )
//{input:")",   output:")"},
//{input:"]",   output:"]"},
{input:"\\rbrack",output:"]"},
//{input:"\\}",   output:"}"},
{input:"\\rbrace",output:"}"},
{input:"\\rangle",output:"\u232A"},
{input:"\\rfloor",output:"\u230B"},
{input:"\\rceil", output:"\u2309"},

// "|", "\\|", "\\vert" and "\\Vert" modified later: lspace = rspace = 0em
//{input:"|",    output:"\u2223"},
{input:"\\|",    output:"\u2225"},
{input:"\\vert",   output:"\u2223"},
{input:"\\Vert",   output:"\u2225"},
{input:"\\mid",    output:"\u2223"},
{input:"\\parallel",   output:"\u2225"},
//{input:"/",    output:"/", atval:"1.01"},   //替换程序陷入死循环
{input:"\\backslash",  output:"\u2216"},
{input:"\\setminus",   output:"\\"},

//miscellaneous symbols
{input:"\\!",   tag:"mspace", atname:"width", atval:"-0.167em"},
{input:"\\,",   tag:"mspace", atname:"width", atval:"0.167em"},
{input:"\\>",   tag:"mspace", atname:"width", atval:"0.222em"},
{input:"\\:",   tag:"mspace", atname:"width", atval:"0.222em"},
{input:"\\;",   tag:"mspace", atname:"width", atval:"0.278em"},
{input:"~",   tag:"mspace", atname:"width", atval:"0.333em"},
{input:"\\quad",  tag:"mspace", atname:"width", atval:"1em"},
{input:"\\qquad", tag:"mspace", atname:"width", atval:"2em"},
{input:"\\prime",  output:"\u2032"},
{input:"'",    output:"\u02B9"},
{input:"''",     output:"\u02BA"},
{input:"'''",    output:"\u2034"},
{input:"''''",     output:"\u2057"},
{input:"\\ldots",  output:"\u2026"},
{input:"\\cdots",  output:"\u22EF"},
{input:"\\cdot",  output:"*"},    //乘号
{input:"\\vdots",  output:"\u22EE"},
{input:"\\ddots",  output:"\u22F1"},
{input:"\\forall",   output:"\u2200"},
{input:"\\exists",   output:"\u2203"},
{input:"\\Re",     output:"\u211C"},
{input:"\\Im",     output:"\u2111"},
{input:"\\aleph",  output:"\u2135"},
{input:"\\hbar",   output:"\u210F"},
{input:"\\ell",    output:"\u2113"},
{input:"\\wp",     output:"\u2118"},
{input:"\\emptyset",   output:"\u2205"},
{input:"\\surd",   output:"\\sqrt{}"},
{input:"\\partial",  output:"\u2202"},
{input:"\\nabla",  output:"\u2207"},
{input:"\\therefore",  output:"\u2234"},
{input:"\\angle",  output:"\u2220"},
{input:"\\diamond",  output:"\u22C4"},
{input:"\\Diamond",  output:"\u25C7"},
{input:"\\neg",    output:"\u00AC"},
{input:"\\lnot",   output:"\u00AC"},
{input:"\\bot",    output:"\u22A5"},
{input:"\\top",    output:"\u22A4"},
{input:"\\square",   output:"\u25AB"},
{input:"\\Box",    output:"\u25A1"},
{input:"\\wr",     output:"\u2240"},

//standard functions
//Note UNDEROVER *must* have tag:"mo" to work properly
{input:"\\deg",     output:"deg"},
{input:"\\det",     output:"det"},
{input:"\\dim",     output:"dim"}, //CONST?
{input:"\\exp",     output:"exp"},
{input:"\\gcd",     output:"gcd"}, //CONST?
{input:"\\hom",     output:"hom"},
{input:"\\ker",     output:"ker"},
{input:"\\lg",      output:"lg"},
{input:"\\liminf",     output:"liminf"},
{input:"\\limsup",     output:"limsup"},
{input:"\\lim",        output:"lim"},
//{input:"\\ln",      output:"ln"},
//{input:"\\log",     output:"log"},
{input:"\\max",        output:"max"},
{input:"\\min",        output:"min"},
{input:"\\Pr",      output:"Pr"},
{input:"\\arg",     output:"arg"},
{input:"\\arcsinh",  output:"arcsinh"},//新增
{input:"\\arcsin",    output:"arcsin"},
{input:"\\asin",     output:"arcsin"},//新增
{input:"\\sinh",    output:"sinh"},
{input:"\\sin",     output:"sin"},
{input:"\\arccosh",  output:"arccosh"},//新增
{input:"\\arccos",  output:"arccos"},
{input:"\\acos",     output:"arccosh"},//新增
{input:"\\cosh",    output:"cosh"},
{input:"\\cos",     output:"cos"},
{input:"\\arctanh",  output:"arctanh"},//新增
{input:"\\arctan",  output:"arctan"},
{input:"\\atan",     output:"arctan"},//新增
{input:"\\tanh",    output:"tanh"},
{input:"\\tan",     output:"tan"},
{input:"\\arccoth",  output:"arccoth"},//新增
{input:"\\arccot",  output:"arccot"},
{input:"\\acot",     output:"arccot"},//新增
{input:"\\coth",    output:"coth"},
{input:"\\cot",     output:"cot"},
{input:"\\arcsech",  output:"arcsech"},//新增
{input:"\\arcsec",  output:"arcsec"},
{input:"\\asec",     output:"arcsec"},//新增
{input:"\\sech",    output:"sech"},
{input:"\\sec",     output:"sec"},
{input:"\\arccsch",  output:"arccsch"},//新增
{input:"\\arccsc",  output:"arccsc"},
{input:"\\acsc",     output:"arccsc"},//新增
{input:"\\csch",    output:"csch"},
{input:"\\csc",     output:"csc"},

//arrows
{input:"\\gets",     output:"\u2190"},
{input:"\\leftarrow",    output:"←"},
{input:"\\rightarrow",     output:"→"},
{input:"\\leftrightarrow",   output:"\u2194"},
{input:"\\uparrow",    output:"\u2191"},
{input:"\\downarrow",    output:"\u2193"},
{input:"\\updownarrow",    output:"\u2195"},
{input:"\\Leftarrow",    output:"\u21D0"},
{input:"\\Rightarrow",     output:"\u21D2"},
{input:"\\Leftrightarrow",   output:"\u21D4"},
{input:"\\iff",  output:"~\\Longleftrightarrow~"},
{input:"\\Uparrow",    output:"\u21D1"},
{input:"\\Downarrow",    output:"\u21D3"},
{input:"\\Updownarrow",    output:"\u21D5"},
{input:"\\mapsto",     output:"\u21A6"},
{input:"\\longleftarrow",  output:"\u2190"},
{input:"\\longrightarrow",   output:"\u2192"},
{input:"\\longleftrightarrow",   output:"\u2194"},
{input:"\\Longleftarrow",  output:"\u21D0"},
{input:"\\Longrightarrow",   output:"\u21D2"},
{input:"\\implies",    output:"\u21D2"},
{input:"\\Longleftrightarrow",   output:"\u21D4"},
{input:"\\longmapsto",     output:"\u21A6"},
              // disaster if LONG

//commands with argument
//{input:"\\sqrt",  tag:"msqrt", output:"sqrt"},
//{input:"\\root",  tag:"mroot", output:"root"},
//{input:"\\frac",  tag:"mfrac", output:"/"},
{input:"\\stackrel",     output:"stackrel"},
{input:"\\atop",  tag:"mfrac", output:""},
{input:"\\choose",      tag:"mfrac", output:""},
//{input:"_",   tag:"msub",  output:"_"},
//{input:"^",   tag:"msup",  output:"^"},
{input:"\\mathrm",  tag:"mtext", output:"text"},
{input:"\\mbox",  tag:"mtext", output:"mbox"},

//diacritical marks
{input:"\\acute",   output:"\u00B4"},
{input:"\\grave",   output:"\u0060"},
{input:"\\breve",   output:"\u02D8"},
{input:"\\check",   output:"\u02C7"},
{input:"\\dot",     output:"."},
{input:"\\ddot",    output:".."},
{input:"\\mathring",    output:"\u00B0"},
{input:"\\vec",     output:"\u20D7"},
{input:"\\overrightarrow",output:"\u20D7"},
{input:"\\overleftarrow", output:"\u20D6"},
{input:"\\hat",     output:"\u005E"},
{input:"\\widehat",   output:"\u0302"},
{input:"\\tilde",   output:"~"},
{input:"\\widetilde",   output:"\u02DC"},
{input:"\\bar",     output:"\u203E"},
{input:"\\overbrace",   output:"\u23B4"},
{input:"\\overline",    output:"\u00AF"},
{input:"\\underbrace",  tag:"munder", output:"\u23B5"},
{input:"\\underline", tag:"munder", output:"\u00AF"},

 //其它
{input:"\\pi",    output:"pi"},//新增
{input:"，",    output:","},//新增
{input:"。",   output:"."},//新增
{input:"∣",   output:"|"},//新增
{input:"\\backslash",   output:"\\"},//新增

//需要注意替换次序的字符
{input:"\\infty",  output:"\u221E"},//miscellaneous symbols
{input:"\\inf",        output:"inf"},//standard functions
{input:"\\int",    output:"\u222B"},//BIG Operators
{input:"\\in",     output:"\u2208"},//binary relation symbols

{input:"\\ne",     output:"\u2260"},//binary relation symbols
{input:"\\sup",        output:"sup"},//standard functions
{input:"\\to",       output:"\u2192"},//arrows
{input:"\\triangle",   output:"\u25B3"},//miscellaneous symbols

{input:"\\left[",    output:"["},//新增
{input:"\\right]",   output:"]"},//新增
{input:"\\left(",    output:"("},//新增
{input:"\\right)",   output:")"},//新增
{input:"\\left\\{",    output:"{"},//新增
{input:"\\right\\}",   output:"}"},//新增

//{input:"\\left|",    output:"|"},//新增
//{input:"\\right|",   output:"|"},//新增
//{input:"\\left",    output:"X"},//grouping and literal brackets -- ieval is for IE
//{input:"\\right",   output:"X"},//grouping and literal brackets -- ieval is for IE

//{input:"\\le",     output:"\u2264"}    //binary relation symbols

];


//////////////////////////////////////////////////////////////////////////////////////////////////////

function analyticMainProcess(mstr){    //函数解析式主处理程序
   
   mstr=LatexCharReplace(mstr);          //替换Latex结果中的特殊字符
   mstr=removeBlanks(mstr);              //去除空格
   mstr=fracProcess(mstr);               //分式\frac{ }{ }
   mstr=divProcess(mstr);                //分式^{ }/_{ }
   mstr=sqrtProcess(mstr);               //平方根式\sqrt{ }
   mstr=nthrootProcess(mstr);            //n次根号\sqrt[ ]{ }
   mstr=logProcess(mstr);                //对数\log_{ } 
   mstr=lnProcess(mstr);                 //对数\ln
   mstr=powProcess(mstr);                //乘方pow(x,y)
   mstr=textProcess(mstr);               //文本text{ }
   mstr=absProcess(mstr);                //绝对值||
   mstr=bigBracketProcess(mstr);         //大括号{ }
   //mstr=middleBracketProcess(mstr);    //中括号[ ]，不处理
   mstr=smallBracketProcess(mstr);       //小括号( )

   while(mstr.indexOf("\\le")>-1)mstr=mstr.replace("\\le","\u2264");
   return mstr;
}//function-  

function removeBlanks(mstr){          //去除空格
  while(mstr.indexOf(" ")>-1){
    mstr=mstr.replace(" ","");
  }
  return mstr;
}//function-  

function LatexCharReplace(mstr){   // Latex替换特殊字母
  var old="";
  var ch="";
  for(var i=0;i<LMsymbols.length;i++){
     old=LMsymbols[i].input;
     ch=LMsymbols[i].output;
     while(mstr.indexOf(old)>-1){         
         mstr=mstr.replace(old,ch);
     }
  }//for
  return mstr;
}//function-          

function fracProcess(mstr){    //处理分式\frac{ }{ }
  var start=mstr.indexOf("\\frac{");        //开始检索位置
  if(start==-1){                           //如果没有分式，直接返回
      return mstr;
  }
  var L1=mstr.indexOf("{",start);
  var R1=_rightBracketMatch(mstr,"{","}",L1);    //右括号匹配
  var L2=R1+1;
  var R2=_rightBracketMatch(mstr,"{","}",L2);    //右括号匹配
  var numerator=mstr.slice(L1+1,R1);        //分子
  var denominator=mstr.slice(L2+1,R2);      //分母
  var lStr=mstr.slice(0,start);             //分数左侧字符
  var rStr=mstr.slice(R2+1);                //分数右侧字符
  mstr=lStr+"("+numerator+")/("+denominator+")"+rStr; 
  if(mstr.indexOf("\\frac{")>-1){ 
    mstr=fracProcess(mstr);   //递归处理
  }
  return mstr;
}//function-

function divProcess(mstr){    //处理分式^{ }/_{ }
  var start=mstr.indexOf("}/_{");        //开始检索位置
  if(start==-1){                           //如果没有分式，直接返回
      return mstr;
  }
  var R1=start;
  var L1=_leftBracketMatch(mstr,"{","}",R1);   //左括号匹配
  var L2=start+3;
  var R2=_rightBracketMatch(mstr,"{","}",L2);    //右括号匹配
  var numerator=mstr.slice(L1+1,R1);        //分子
  var denominator=mstr.slice(L2+1,R2);      //分母
  var lStr=mstr.slice(0,L1-1);              //分数左侧字符
  var rStr=mstr.slice(R2+1);                //分数右侧字符
  mstr=lStr+"("+numerator+")/("+denominator+")"+rStr;
  if(mstr.indexOf("}/_{")>-1){ 
    mstr=divProcess(mstr);   //递归处理
  }
  return mstr;
}//function-

function sqrtProcess(mstr){    //处理分平方根式\sqrt{ }
  var start=mstr.indexOf("\\sqrt{");        //开始检索位置
  if(start==-1){                           //如果没有分式，直接返回
      return mstr;
  }
  var L=mstr.indexOf("{",start);
  var R=_rightBracketMatch(mstr,"{","}",L);    //右括号匹配
  var value=mstr.slice(L+1,R);                 //分子
  var lStr=mstr.slice(0,start);                //分数左侧字符
  var rStr=mstr.slice(R+1);                    //分数右侧字符
  mstr=lStr+"sqrt("+value+")"+rStr;
  if(mstr.indexOf("\\sqrt{")>-1){ 
    mstr=sqrtProcess(mstr);   //递归处理
  }
  return mstr;
}//function-

function nthrootProcess(mstr){    //处理n次根号\sqrt[ ]{ }
  var start=mstr.indexOf("\\sqrt[");        //开始检索位置
  if(start==-1){                           //如果没有分式，直接返回
      return mstr;
  }
  var L1=mstr.indexOf("[",start);
  var R1=_rightBracketMatch(mstr,"[","]",L1); //右括号匹配
  var L2=R1+1;
  var R2=_rightBracketMatch(mstr,"{","}",L2); //右括号匹配
  var nth=mstr.slice(L1+1,R1);               //n次根
  var value=mstr.slice(L2+1,R2);             //内容
  var lStr=mstr.slice(0,start);             //分数左侧字符
  var rStr=mstr.slice(R2+1);                //分数右侧字符
  if(nth=="1"){
    mstr=lStr+value+rStr;
  }else{
      if(value.length>=2)value="("+value+")";  
      mstr=lStr+"("+value+"^(1/"+nth+"))"+rStr;         // a^b --> pow(a,b)
  }//if
  if(mstr.indexOf("\\sqrt[")>-1){ 
    mstr=nthrootProcess(mstr);   //递归处理
  }//if
  return mstr;
}//function-
           
function logProcess(mstr){                   // 对数\log_{ }
  var start=mstr.indexOf("\\log_{");        //开始检索位置
  if(start==-1){                           //如果没有分式，直接返回
      return mstr;
  }
  var L=mstr.indexOf("{",start);
  var R=_rightBracketMatch(mstr,"{","}",L);    //右括号匹配
  var di=mstr.slice(L+1,R);                 //对数的底
  var lStr=mstr.slice(0,start);             //对数左侧字符
  var ch=mstr.charAt(R+1);
  if(ch!="("){          //对数log_{2}12345,log_{2}a
    var result=_getNumber(mstr.slice(R+1));                //求值
    var value=result.N;
    var rStr=result.R; 
  }else if(ch=="("){    //对数log_{2}(a+b)
     var L2=R+1;
     var R2=_rightBracketMatch(mstr,"(",")",L2); //右括号匹配
     var value=mstr.slice(L2+1,R2);
     var rStr=mstr.slice(R2+1);
  }//if

  if(di=="e"||di=="E"){                     //自然对数e
    mstr=lStr+"log("+value+")"+rStr;
  }else if(di!=""){
    mstr=lStr+"log("+value+")/log("+di+")"+rStr;//对数换底公式
  }
  if(mstr.indexOf("\\log_{")>-1){ 
    mstr=logProcess(mstr);   //递归处理
  }
  return mstr;
}//function-

function lnProcess(mstr){                   // 对数\ln
  var start=mstr.indexOf("\\ln");        //开始检索位置
  if(start==-1){                           //如果没有分式，直接返回
      return mstr;
  }
  var lStr=mstr.slice(0,start);             //对数左侧字符
  var ch=mstr.charAt(start+3);
  if(ch!="("){          //对数log_{2}12345,log_{2}a
    var result=_getNumber(mstr.slice(start+3));                //求值
    var value=result.N;
    var rStr=result.R; 
  }else if(ch=="("){    //对数log_{2}(a+b)
     var L2=start+3;
     var R2=_rightBracketMatch(mstr,"(",")",L2); //右括号匹配
     var value=mstr.slice(L2+1,R2);
     var rStr=mstr.slice(R2+1);
  }//if
  mstr=lStr+"log("+value+")"+rStr;    //自然对数               
  if(mstr.indexOf("\\ln")>-1){ 
    mstr=lnProcess(mstr);   //递归处理
  }
  return mstr;
}//function-

function _getNumber(str){  //获取数字：整数，小数
  
  if(str.charAt(0)>="0"&&str.charAt(0)<="9"){    //第1个字母为数字
     var k=1;
  }else if((str.charAt(0)=="+"||str.charAt(0)=="-")&&(str.charAt(1)>="0"&&str.charAt(1)<="9")){ //第1个字母为+或-，第2个字母为数字
     var k=2;
  }else{
     return {
              N:str.charAt(0),
              R:str.slice(1)
           };
  }//if-else
  var ch=str.charAt(k);
  while(ch>="0"&&ch<="9"&&k<=str.length) {
    ch=str.charAt(k++);
  }//while
  if(ch=="."){    //小数点
    ch=str.charAt(++k);
    if(ch>="0"&&ch<="9"){  
      ch=str.charAt(++k);
      while(ch>="0"&&ch<="9"&&k<=str.length){
        ch=str.charAt(++k);
      }
    }
  }//if
  var number=str.slice(0,k);
  var rest=str.slice(k);
  return {
          N:number,
          R:rest
         };
}//function-

function powProcess(mstr){   //乘方pow(x,y)
  var start=mstr.indexOf("^{");        
  var end=mstr.indexOf("}");
  if(start==-1||end==-1)return mstr;
  if(mstr.slice(start-1,start)=="}")return mstr;                       //排除∫_{}^{}，∮_{}^{}
  if(mstr.length>=(end+3)&&mstr.slice(end,end+3)=="}_{")return mstr;   //排除x^{ }_{ }
  if(mstr.length>=(end+4)&&mstr.slice(end,end+4)=="}/_{")return mstr;  //排除^{ }/_{ }
  var L=start+1;
  var R=_rightBracketMatch(mstr,"{","}",L);    //右括号匹配
  var y=mstr.slice(L+1,R);         //乘方pow(x,y)
  var x=mstr.slice(start-1,start);
  if(x!=")"){
    var lStr=mstr.slice(0,start-1);             //分数左侧字符
    var rStr=mstr.slice(R+1);                //分数右侧字符
    if(y.length>=2)y="("+y+")";
    mstr=lStr+"("+x+"^"+y+")"+rStr;         // a^b --> pow(a,b)
  }//if
  if(x==")"){
    var R2=start-1;   //")"位置
    var L2=_leftBracketMatch(mstr,"(",")",R2);   //左括号匹配
    x=mstr.slice(L2+1,R2);
    var lStr=mstr.slice(0,L2);             //左侧字符
    var rStr=mstr.slice(R+1);                //分数右侧字符
    if(y.length>=2)y="("+y+")";  
    mstr=lStr+"("+x+"^"+y+")"+rStr;         // a^b --> pow(a,b)
  }//if
  if(mstr.indexOf("^{")>-1&&mstr.indexOf("}")>-1){ 
    mstr=powProcess(mstr);
  }
  return mstr;
}//function-   

function absProcess(mstr){          //绝对值||
  var start=mstr.indexOf("\\left|");         
  var end=mstr.indexOf("\\right|");  
  if(start==-1||end==-1){                        //无绝对值
      return mstr;
  }
  var lStr=mstr.slice(0,start);             //左侧字符
  var rStr=mstr.slice(end+7);               //右侧字符
  var value=mstr.slice(start+6,end);             
  mstr=lStr+"abs("+value+")"+rStr;  
  if(mstr.indexOf("\\left|")>-1&&mstr.indexOf("\\right|")>-1){ 
    mstr=absProcess(mstr);         //递归处理
  }
  return mstr;
}//function-  

function getValue(rStr){          //求值
  var operator=[           //运算符集合
      ",","!","@","#","$",
      "%","^","*","+","-","±",
      "∗","/","△","=","≠","≈",
      ">","<","≥","≤","∞","∩",
      "∪","∵","∴","∈","←",
      "→","↔","∑","∫","∮","∗",
      "⊂","⊃","⊆","⊇","⊈","⊉",
      "∋","∉","↦","⇐","⇔","~"
   ];  
  var value="";    //值
  var index=-1;
  for(var i=0;i<operator.length;i++){       //右侧字符串中是否含有分隔符
    index=rStr.indexOf(operator[i]);
    if(index>-1){
      value=rStr.slice(0,index);  //计算对数的值value
      rStr=rStr.slice(index);
      break;
    }
  }//for
  if(value==""){   //如果右侧字符串中没有分隔符，那么整个作为value
    value=rStr;
    rStr="";
  }
  return {
           V:value,
           R:rStr
         };
}//function-


function bigBracketProcess(str){                    //处理{}括号
  if(str.indexOf("{")==-1||str.lastIndexOf("}")==-1){ 
     return str;
  }
  var flag=[];             //标志{和}可否删除
  var leftStack=[];        //左栈
  var rightStack=[];       //右栈
  var ch="";
  for(var i=0;i<str.length;i++){
    flag[i]=false;         //初始化，{和}均不可删除
    ch=str.charAt(i);
    if(ch=="{"){
      leftStack.push(i);//左栈
    }
    if(ch=="}"){
      rightStack.push(i);//右栈
    }
  }//for-i
  if(leftStack.length!=rightStack.length){
    alert("{和}个数不等！");
    return str;
  }
  if(leftStack.length==0&&rightStack.length==0){
    alert("无{和}");
    return str;
  }
  var num=leftStack.length;  //  {的个数，即}的个数
  var sub="";                //子串
  for(var j=0;j<num;j++){
    sub=str.slice(leftStack[j],rightStack[j]+1); 
    if(sub.indexOf(",")==-1){    //没有分隔符，应当删除此对{和}
       flag[leftStack[j]]=true;
       flag[rightStack[j]]=true;
    }//if
  }//for-j
  var array=str.split("");     //字符串转化成数组
  for(var k=str.length;k>=0;k--){
    if(flag[k]==true){
      array.splice(k,1);//删除
    }
  }//for-k
  str=array.join("");//返回包含所有数组项的字符串
  return str;
}//function-

function smallBracketProcess(str){                    //处理( )小括号
  if(str.indexOf("(")==-1||str.lastIndexOf(")")==-1){ 
     return str;
  }
  var flag=[];             //标志(和)可否删除
  var leftStack=[];        //左栈
  var brackets=[];         //括号对
  var L=-1,R=-1;
  var ch="";
  for(var i=0;i<str.length;i++){
    flag[i]=false;         //初始化，{和}均不可删除
    ch=str.charAt(i);
    if(ch=="("){
      leftStack.push(i);//左栈
    }
    if(ch==")"){          //遇到)，并且左栈顶为(  
      brackets.push({                 //记下匹配的括号下标
                     L:leftStack.pop(),
                     R:i}
                   );  
    }
  }//for-i
  //alert(leftStack);
  //alert(brackets[0].L+"#"+brackets[0].R);
  if(leftStack.length!=0){
    alert("(和)个数不等！");
    return str;
  }
  for(var j=0;j<brackets.length;j++){
    var L=parseInt(brackets[j].L);
    var R=parseInt(brackets[j].R);
    var sub=str.slice(L,R+1); //子串
    var can=_hasSpecial(str,L);//可否删除
    if(sub.length<=3&&can){    //字符小于3并且不含有特殊函数，应当删除此对(和)
       flag[L]=true;
       flag[R]=true;
    }//if
  }//for-j

  var array=str.split("");     //字符串转化成数组
  for(var k=str.length;k>=0;k--){
    if(flag[k]==true){
      array.splice(k,1);//删除
    }
  }//for-k
  str=array.join("");//返回包含所有数组项的字符串
  return str;
}//function-

function _hasSpecial(str,k){    //是否含有特殊函数
  var input=[
              "arcsinh","arcsin","arcsinh","sin",
              "arccosh","arccos","arccosh","cos",
              "arctanh","arctan","arctanh","tan",
              "arccoth","arccot","arccoth","cot",
              "arcsech","arcsec","arcsech","sec",
              "arccsch","arccsc","arccsch","csc",
              "sqrt","log","ln","floor","max","round",
              "min","gcd","∑","abs","exp","ceil"       
          ];
  var pos=-1;        
  for(var i=0;i<str.length;i++){
  	for(var j=0;j<input.length;j++){
       pos=str.indexOf(input[j],i);
       if(pos>-1){
          pos+=input[j].length;
          if(pos==k)return false;
       }
  	}//for-j
  }//for-i
  return true;
}//function-

function textProcess(mstr){                 //文本text{ }
  //"\\text{sign}","\\text{exp}","\\text{pow}","\\text{floor}","\\text{ceil}","\\text{max}",
  //"\\text{min}","\\text{round}","\\text{random}","\\text{sin}","\\text{cos}",""\\text{tan}",

  var start=mstr.indexOf("\\text{");        //开始检索位置
  if(start==-1){                           //如果没有文本text{，直接返回
      return mstr;
  }
  var L=mstr.indexOf("{",start);
  var R=_rightBracketMatch(mstr,"{","}",L); //右括号匹配
  var di=mstr.slice(L+1,R);                 //对数的底
  var lStr=mstr.slice(0,start);             //对数左侧字符
  var rStr=mstr.slice(R+1);                 //对数右侧字符
  mstr=lStr+di+rStr;
  if(mstr.indexOf("\\text{")>-1){ 
    mstr=textProcess(mstr);   //递归处理
  }
  return mstr;
}//function-

function _rightBracketMatch(mstr,lc,rc,L){    //右括号匹配
   //返回str从第L位置开始，与lc匹配成对rc的下标
  var R=-1;
  var start=mstr.indexOf(lc,L);        //开始检索位置
  if(start==-1||mstr.indexOf(rc,L)==-1){                           //如果没有分式，直接返回
      return -1;
  }
  var ch="";
  var stack=[];            //栈{}
  var left=-1;
  for(var i=start;i<mstr.length;i++){
    ch=mstr.charAt(i);
    if(ch==lc){
      stack.push(i);       //压入{
    }//if
    if(ch==rc){
      left=stack.pop();     //弹出{
      if(left==L){         //找到内容
         R=i;
         break;
      }
    }//if
  }//for-i
  return R;
}//function-

function _leftBracketMatch(mstr,lc,rc,R){    //左括号匹配
   //返回str与lc匹配成对rc并且以下标R结尾
  var L=-1;
  var end=mstr.lastIndexOf(rc,R);        //开始检索位置
  if(end==-1||mstr.lastIndexOf(lc,R)==-1){                           //如果没有分式，直接返回
      return -1;
  }
  var ch="";
  var stack=[];            //栈{}
  var left=-1;
  for(var i=end;i>=0;i--){
    ch=mstr.charAt(i);
    if(ch==rc){
      stack.push(i);       //压入}
    }//if
    if(ch==lc){
      left=stack.pop();     //弹出}
      if(left==R){         //找到分子
         L=i;
         break;
      }
    }//if
  }//for-i
  return L;
}//function-


