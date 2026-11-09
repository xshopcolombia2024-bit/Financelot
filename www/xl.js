window.XL=(function(){
const E=s=>String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const L=n=>{let s='';for(n++;n>0;n=((n-1)/26)|0)s=String.fromCharCode(65+(n-1)%26)+s;return s};
const H='<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n',M='http://schemas.openxmlformats.org/',
NS=`xmlns="${M}spreadsheetml/2006/main" xmlns:r="${M}officeDocument/2006/relationships"`,
CN=`xmlns:c="${M}drawingml/2006/chart" xmlns:a="${M}drawingml/2006/main" xmlns:r="${M}officeDocument/2006/relationships"`,
RT=`${M}officeDocument/2006/relationships/`,RS=`<Relationships xmlns="${M}package/2006/relationships">`;
const rg=(s,c,a,b)=>`${s}!$${L(c)}$${a+1}:$${L(c)}$${b+1}`;
function cell(v,r,c){const ref=L(c)+(r+1);let s=0,f=null,x=v;if(v&&typeof v==='object'){s=v.s||0;f=v.f;x=v.v}
 if(f!=null)return`<c r="${ref}" s="${s}"><f>${E(f)}</f>${typeof x==='number'?`<v>${x}</v>`:''}</c>`;
 if(typeof x==='number')return`<c r="${ref}" s="${s}"><v>${x}</v></c>`;
 if(x==null||x==='')return s?`<c r="${ref}" s="${s}"/>`:'';
 return`<c r="${ref}" s="${s}" t="inlineStr"><is><t xml:space="preserve">${E(x)}</t></is></c>`}
function sheet(sh,dr){const rows=sh.rows.map((r,i)=>`<row r="${i+1}">${r.map((v,j)=>cell(v,i,j)).join('')}</row>`).join('');
 return H+`<worksheet ${NS}><sheetPr><pageSetUpPr fitToPage="1"/></sheetPr><sheetViews><sheetView ${sh.nogrid?'showGridLines="0" ':''}workbookViewId="0">${sh.freeze?'<pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/>':''}</sheetView></sheetViews>${sh.w?`<cols>${sh.w.map((w,i)=>`<col min="${i+1}" max="${i+1}" width="${w}" customWidth="1"/>`).join('')}</cols>`:''}<sheetData>${rows}</sheetData>${sh.filter?`<autoFilter ref="${sh.filter}"/>`:''}<pageSetup orientation="landscape" fitToWidth="1" fitToHeight="0"/>${dr?'<drawing r:id="rId1"/>':''}</worksheet>`}
const xf=(n,f,fi,al)=>`<xf numFmtId="${n}" fontId="${f}" fillId="${fi}" borderId="0" xfId="0" applyNumberFormat="1" applyFont="1" applyFill="1"${al?' applyAlignment="1"><alignment horizontal="center" vertical="center" wrapText="1"/></xf>':'/>'}`;
const STY=H+`<styleSheet xmlns="${M}spreadsheetml/2006/main"><fonts count="4"><font><sz val="11"/><name val="Calibri"/></font><font><b/><sz val="11"/><color rgb="FFFFFFFF"/><name val="Calibri"/></font><font><b/><sz val="11"/><name val="Calibri"/></font><font><b/><sz val="16"/><color rgb="FF0F766E"/><name val="Calibri"/></font></fonts><fills count="3"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill><fill><patternFill patternType="solid"><fgColor rgb="FF0F766E"/><bgColor indexed="64"/></patternFill></fill></fills><borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders><cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs><cellXfs count="8">${xf(0,0,0)}${xf(0,1,2,1)}${xf(4,0,0)}${xf(14,0,0)}${xf(10,0,0)}${xf(0,3,0)}${xf(0,2,0)}${xf(4,2,0)}</cellXfs><cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles></styleSheet>`;
function chart(c){
 const fill=h=>`<c:spPr><a:solidFill><a:srgbClr val="${h}"/></a:solidFill></c:spPr>`,cat=`<c:cat><c:strRef><c:f>${c.cat}</c:f></c:strRef></c:cat>`;
 const ser=(s,i)=>{const nm=`<c:idx val="${i}"/><c:order val="${i}"/><c:tx><c:v>${E(s.n)}</c:v></c:tx>`,val=`<c:val><c:numRef><c:f>${s.v}</c:f></c:numRef></c:val>`;
  if(c.k==='dnut')return`<c:ser>${nm}${(c.cols||[]).map((h,j)=>`<c:dPt><c:idx val="${j}"/><c:bubble3D val="0"/>${fill(h)}</c:dPt>`).join('')}<c:dLbls><c:numFmt formatCode="0%" sourceLinked="0"/><c:spPr><a:noFill/></c:spPr><c:showLegendKey val="0"/><c:showVal val="0"/><c:showCatName val="0"/><c:showSerName val="0"/><c:showPercent val="1"/><c:showBubbleSize val="0"/><c:showLeaderLines val="1"/></c:dLbls>${cat}${val}</c:ser>`;
  if(c.k==='line')return`<c:ser>${nm}<c:spPr><a:ln w="31750"><a:solidFill><a:srgbClr val="${s.c}"/></a:solidFill></a:ln></c:spPr><c:marker><c:symbol val="circle"/><c:size val="6"/></c:marker>${cat}${val}<c:smooth val="0"/></c:ser>`;
  return`<c:ser>${nm}${fill(s.c)}<c:invertIfNegative val="0"/>${cat}${val}</c:ser>`};
 const S=c.s.map(ser).join(''),ax=`<c:catAx><c:axId val="1"/><c:scaling><c:orientation val="minMax"/></c:scaling><c:delete val="0"/><c:axPos val="b"/><c:numFmt formatCode="General" sourceLinked="0"/><c:majorTickMark val="none"/><c:minorTickMark val="none"/><c:tickLblPos val="low"/><c:crossAx val="2"/><c:crosses val="autoZero"/><c:auto val="1"/><c:lblAlgn val="ctr"/><c:lblOffset val="100"/><c:noMultiLvlLbl val="0"/></c:catAx><c:valAx><c:axId val="2"/><c:scaling><c:orientation val="minMax"/></c:scaling><c:delete val="0"/><c:axPos val="l"/><c:majorGridlines><c:spPr><a:ln><a:solidFill><a:srgbClr val="E5E7EB"/></a:solidFill></a:ln></c:spPr></c:majorGridlines><c:numFmt formatCode="#,##0" sourceLinked="0"/><c:majorTickMark val="none"/><c:minorTickMark val="none"/><c:tickLblPos val="nextTo"/><c:crossAx val="1"/><c:crosses val="autoZero"/><c:crossBetween val="between"/></c:valAx>`;
 const body=c.k==='dnut'?`<c:doughnutChart><c:varyColors val="1"/>${S}<c:firstSliceAng val="0"/><c:holeSize val="55"/></c:doughnutChart>`:c.k==='line'?`<c:lineChart><c:grouping val="standard"/><c:varyColors val="0"/>${S}<c:marker val="1"/><c:axId val="1"/><c:axId val="2"/></c:lineChart>${ax}`:`<c:barChart><c:barDir val="col"/><c:grouping val="clustered"/><c:varyColors val="0"/>${S}<c:gapWidth val="80"/><c:axId val="1"/><c:axId val="2"/></c:barChart>${ax}`;
 return H+`<c:chartSpace ${CN}><c:roundedCorners val="0"/><c:chart><c:title><c:tx><c:rich><a:bodyPr/><a:p><a:pPr><a:defRPr sz="1300" b="1"/></a:pPr><a:r><a:rPr lang="es-CO" sz="1300" b="1"/><a:t>${E(c.t)}</a:t></a:r></a:p></c:rich></c:tx><c:overlay val="0"/></c:title><c:autoTitleDeleted val="0"/><c:plotArea><c:layout/>${body}</c:plotArea><c:legend><c:legendPos val="b"/><c:overlay val="0"/></c:legend><c:plotVisOnly val="1"/><c:dispBlanksAs val="gap"/></c:chart></c:chartSpace>`}
async function build(sheets){const z=new JSZip();let ct='',wb='',wr='',nd=0,nc=0;
 sheets.forEach((sh,i)=>{const n=i+1,ch=sh.charts||[];
  z.file(`xl/worksheets/sheet${n}.xml`,sheet(sh,ch.length>0));
  ct+=`<Override PartName="/xl/worksheets/sheet${n}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>`;
  wb+=`<sheet name="${E(sh.name)}" sheetId="${n}" r:id="rId${n}"/>`;wr+=`<Relationship Id="rId${n}" Type="${RT}worksheet" Target="worksheets/sheet${n}.xml"/>`;
  if(ch.length){nd++;let dr='',rl='';
   ch.forEach((c,j)=>{nc++;z.file(`xl/charts/chart${nc}.xml`,chart(c));ct+=`<Override PartName="/xl/charts/chart${nc}.xml" ContentType="application/vnd.openxmlformats-officedocument.drawingml.chart+xml"/>`;
    rl+=`<Relationship Id="rId${j+1}" Type="${RT}chart" Target="../charts/chart${nc}.xml"/>`;const[a,b,e,f]=c.at;
    dr+=`<xdr:twoCellAnchor><xdr:from><xdr:col>${a}</xdr:col><xdr:colOff>0</xdr:colOff><xdr:row>${b}</xdr:row><xdr:rowOff>0</xdr:rowOff></xdr:from><xdr:to><xdr:col>${e}</xdr:col><xdr:colOff>0</xdr:colOff><xdr:row>${f}</xdr:row><xdr:rowOff>0</xdr:rowOff></xdr:to><xdr:graphicFrame macro=""><xdr:nvGraphicFramePr><xdr:cNvPr id="${j+2}" name="Gráfico ${j+1}"/><xdr:cNvGraphicFramePr/></xdr:nvGraphicFramePr><xdr:xfrm><a:off x="0" y="0"/><a:ext cx="0" cy="0"/></xdr:xfrm><a:graphic><a:graphicData uri="${M}drawingml/2006/chart"><c:chart xmlns:c="${M}drawingml/2006/chart" r:id="rId${j+1}"/></a:graphicData></a:graphic></xdr:graphicFrame><xdr:clientData/></xdr:twoCellAnchor>`});
   z.file(`xl/drawings/drawing${nd}.xml`,H+`<xdr:wsDr xmlns:xdr="${M}drawingml/2006/spreadsheetDrawing" xmlns:a="${M}drawingml/2006/main" xmlns:r="${M}officeDocument/2006/relationships">${dr}</xdr:wsDr>`);
   z.file(`xl/drawings/_rels/drawing${nd}.xml.rels`,H+RS+rl+'</Relationships>');
   z.file(`xl/worksheets/_rels/sheet${n}.xml.rels`,H+RS+`<Relationship Id="rId1" Type="${RT}drawing" Target="../drawings/drawing${nd}.xml"/></Relationships>`);
   ct+=`<Override PartName="/xl/drawings/drawing${nd}.xml" ContentType="application/vnd.openxmlformats-officedocument.drawing+xml"/>`}});
 const n=sheets.length;
 z.file('xl/workbook.xml',H+`<workbook ${NS}><bookViews><workbookView/></bookViews><sheets>${wb}</sheets><calcPr fullCalcOnLoad="1"/></workbook>`);
 z.file('xl/_rels/workbook.xml.rels',H+RS+wr+`<Relationship Id="rId${n+1}" Type="${RT}styles" Target="styles.xml"/></Relationships>`);
 z.file('xl/styles.xml',STY);
 z.file('_rels/.rels',H+RS+`<Relationship Id="rId1" Type="${RT}officeDocument" Target="xl/workbook.xml"/></Relationships>`);
 z.file('[Content_Types].xml',H+`<Types xmlns="${M}package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>${ct}</Types>`);
 return z.generateAsync({type:'uint8array',compression:'DEFLATE'})}
return{build,rg}})();
