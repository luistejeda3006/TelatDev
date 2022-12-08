export default ( nom, pat, mat, fecha, genero, edo ) => {
    console.log('nom: ', nom, 'pat: ', pat, 'mat: ', mat, 'fecha: ', fecha, 'genero: ', genero, 'edo: ', edo)
    console.log('dia: ', fecha.substring(8,10))
    console.log('mes: ', fecha.substring(5,7))
    console.log('año: ', fecha.substring(2,4))
    let fechita = `${fecha.substring(8,10)}-${fecha.substring(5,7)}-${fecha.substring(0,4)}`
    var quitar, nombres, curp;
    nom=nom.toUpperCase();
    pat=pat.toUpperCase();
    mat=mat.toUpperCase();
    genero=genero.toUpperCase();

    quitar= new RegExp(/^(DE |DEL |LO |LOS |LA |LAS )+/);
    nombres=new RegExp(/^(MARIA |JOSE )/);
    nom=nom.replace(quitar,'');
    nom=nom.replace(nombres,'');
    nom=nom.replace(quitar,'');
    pat=pat.replace(quitar,'');
    mat=mat.replace(quitar,'');
    if (mat=='') mat='X';
    curp  = pat.substring(0,1) + buscaVocal(pat)+ mat.substring(0,1) + nom.substring(0,2);
    curp  = cambiaPalabra(curp);
    curp += fechita.substring(8,10) + fechita.substring(3,5) + fechita.substring(0,2);
    curp += genero + edo;
    curp += buscaConsonante(pat) + buscaConsonante(mat) + buscaConsonante(nom) ;
    curp += fechita.substring(6,8)=='19'?'0':'A';
    curp += ultdig(curp);
    console.log('curp: ', curp)
    return curp;
}
  
const buscaVocal = (str) => {
    var vocales='AEIOU';
    var i, c;
        for(i=1; i<str.length; i++)	{
            c=str.charAt(i);
            if (vocales.indexOf(c)>=0){
                return c;
            }
        }
    return 'X';
}

const buscaConsonante = (str) => {
    var vocales='AEIOU Ññ.';
    var i, c;
        for(i=1; i<str.length; i++)	{
            c=str.charAt(i);
            if ( vocales.indexOf(c)<0 ){
                return c;
            }
        }
    return 'X';
}

const cambiaPalabra = (str) => {
    var pal1=new RegExp(/BUEI|BUEY|CACA|CACO|CAGA|CAGO|CAKA|CAKO|COGE|COJA|COJE|COJI|COJO|CULO|FETO|GUEY/);
    var pal2=new RegExp(/JOTO|KACA|KACO|KAGA|KAGO|KOGE|KOJO|KAKA|KULO|LOCA|LOCO|MAME|MAMO|MEAR|MEAS|MEON/);
    var pal3=new RegExp(/MION|MOCO|MULA|PEDA|PEDO|PENE|PUTA|PUTO|QULO|RATA|RUIN|NACA|NACO/);
    var val;
    str=str.substring(0,4);
    val = pal1.test(str) || pal2.test(str);
    val = pal3.test(str) || val;
    if (val) return str.substring(0,1) + 'X' + str.substring(2,4);
    return str;
}

const tabla = (i, x) => {
    if(i >= '0' && i<= '9') return x-48;
    else if (i>= 'A' && i<= 'N') return x-55;
    else if (i>= 'O' && i<= 'Z') return x-54;
    else return 0;
}

const ultdig = (curp) => {
    var i, c, dv = 0;
    for(i=0; i<curp.length; i++)
    {
        c=tabla(curp.charAt(i), curp.charCodeAt(i));
        dv += c * (18-i);
    }
    dv%=10;
    return dv==0?0:10-dv;
}
