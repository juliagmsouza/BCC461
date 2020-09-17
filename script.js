    window.onload = function() {
        var tabuleirojogo = [
        [0, 1, 0, 1, 0, 1, 0, 1],
        [1, 0, 1, 0, 1, 0, 1, 0],
        [0, 1, 0, 1, 0, 1, 0, 1],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [2, 0, 2, 0, 2, 0, 2, 0],
        [0, 2, 0, 2, 0, 2, 0, 2],
        [2, 0, 2, 0, 2, 0, 2, 0]
    ]
    var individuo = { 
    peca:0,
    forca: 0,
    casa:0,
    tabuleirojogo2: [[]],
    ativacao: []
};
    

    //const tamPopInicial= 10;

  var individuos = [];
  var pesocasas = [
        [0, 4, 0, 4, 0, 4, 0, 4],
        [4, 0, 3, 0, 3, 0, 3, 0],
        [0, 3, 0, 2, 0, 2, 0, 4],
        [4, 0, 2, 0, 1, 0, 3, 0],
        [0, 3, 0, 1, 0, 2, 0, 4],
        [4, 0, 2, 0, 2, 0, 3, 0],
        [0, 3, 0, 3, 0, 3, 0, 4],
        [4, 0, 4, 0, 4, 0, 4, 0]
      ];

    //var primeirageracao =[[],[],[],[],[],[],[],[],[],[]];
  
    var pecas = [];
    var casas = [];
    var pecassimuladas = [];
    var casassimuladas = [];

    var dist = function (x1, y1, x2, y2) {
        return Math.sqrt(Math.pow((x1 - x2), 2) + Math.pow((y1 - y2), 2));
    }

    function Peca (item, posicao){

    this.peso = 5;
    this.permitidomover = true;
    this.item = item;
    this.posicao = posicao;
    this.jogador = '';  
    if (this.item.attr("id") < 12)
        this.jogador = 1;
    else this.jogador =2;

    this.rainha =false;
    this.fazrainha = function (){
        this.item.css("backgroundImage", "url('img/king" + this.jogador + ".png')");
        this.rainha = true;
    }

    

    this.mover = function (casa){
        this.item.removeClass('selecionada');
        if (!Tabuleiro.casavalida(casa.posicao[0], casa.posicao[1])) return false;
        if (this.jogador == 1 && this.rainha == false){
            if(casa.posicao[0] < this.posicao[0]) return false;
        }
        else if ( this.jogador == 2 && this.rainha == false){
            if ( casa.posicao[0] > this.posicao[0]) return false;
        }

        Tabuleiro.tabuleiro[this.posicao[0]][this.posicao[1]] = 0;
        Tabuleiro.tabuleiro[casa.posicao[0]][casa.posicao[1]] = this.jogador;
        this.posicao = [casa.posicao[0],casa.posicao[1]];

        this.item.css('top', Tabuleiro.dictionary[this.posicao[0]]);
        this.item.css('left', Tabuleiro.dictionary[this.posicao[1]]);

        if(!this.rainha && (this.posicao[0] == 0 || this.posicao[0] ==7))
            this.fazrainha();
            return true;
           
    };
    
    this.checarpulos = function () {
        return (this.podecapturaradversario([this.posicao[0] + 2, this.posicao[1] + 2]) ||
          this.podecapturaradversario([this.posicao[0] + 2, this.posicao[1] - 2]) ||
          this.podecapturaradversario([this.posicao[0] - 2, this.posicao[1] + 2]) ||
          this.podecapturaradversario([this.posicao[0] - 2, this.posicao[1] - 2]))
      };

      this.podecapturaradversario = function (novaposicao){
          var dx = novaposicao[1] - this.posicao[1];
          var dy = novaposicao[0] - this.posicao[0];
          if (this.jogador == 1 && this.rainha == false){
            if(novaposicao[0] < this.posicao[0]) return false;
        }
        else if ( this.jogador == 2 && this.rainha == false){
            if ( novaposicao[0] > this.posicao[0]) return false;
        }

        if (novaposicao[0] > 7 || novaposicao [1] > 7 || novaposicao [0] <0 || novaposicao [1] <0) return false;
        var checarcasax = this.posicao[1] + dx / 2;
        var checarcasay = this.posicao[0] + dy / 2;
        if (checarcasax > 7 || checarcasay > 7 || checarcasax < 0 || checarcasay < 0) return false;

        if(!Tabuleiro.casavalida(checarcasay, checarcasax) && Tabuleiro.casavalida(novaposicao[0], novaposicao[1])){
        
        for(let i_peca in pecas){
            if(pecas[i_peca].posicao[0] == checarcasay && pecas[i_peca].posicao[1] == checarcasax){
                if (this.jogador != pecas[i_peca].jogador){
                    return pecas[i_peca];
                }
            }
        }

      }
      return false;
    };

    this.capturaradversario = function(casa){
        var removerpeca = this.podecapturaradversario(casa.posicao);
        if(removerpeca){
            removerpeca.remove();
            return true;
        }
        return false;
    }

    this.remove = function(){
        this.item.css ("display", "none");
        this.peso = 0;
        if(this.jogador == 1){
            $('#jogador2').append("<div class='pecacapturada'></div");
            Tabuleiro.placar.jogador2 += 1;
        }
        if(this.jogador == 2){
            $('#jogador1').append("<div class='pecacapturada'></div");
            Tabuleiro.placar.jogador1 += 1;
        }

        Tabuleiro.tabuleiro[this.posicao[0]][this.posicao[1]]=0;
        this.posicao = [];
        var jogadorvencedor = Tabuleiro.checavencedor();
        if(jogadorvencedor){
            $('#vencedor').html("Jogador " + jogadorvencedor + " venceu!");
        }
    }

    }

    function Casa(item, posicao) {
        this.item = item;
        this.posicao = posicao;
        this.alcance = function (peca){
            for(let i of pecas)
            if (i.posicao[0] == this.posicao[0] && i.posicao[1] == this.posicao[1]) return 'invalido';
            if(!peca.rainha && peca.jogador == 1 && this.posicao[0] < peca.posicao[0]) return 'invalido';
            if(!peca.rainha && peca.jogador == 2 && this.posicao[0] > peca.posicao[0]) return 'invalido';
            if(dist(this.posicao[0], this.posicao[1], peca.posicao[0], peca.posicao[1]) == Math.sqrt(2)){
                return 'regular';
            } else if (dist(this.posicao[0], this.posicao[1], peca.posicao[0], peca.posicao[1]) == 2* Math.sqrt(2)){
                return 'salto';
            }
        };
    }

    var Tabuleiro = {
        tabuleiro: tabuleirojogo,
        placar: {
            jogador1: 0,
            jogador2: 0
        },
        jogadoratual: 1,
        capturaobrigatoria: false,
        capturamultipla: false,
        casasitem: $('div.casas'),
        dictionary: ["0vmin", "10vmin", "20vmin", "30vmin", "40vmin", "50vmin", "60vmin", "70vmin", "80vmin", "90vmin"],
        forcatabuleiro: function (individuo3){
            this.soma = 0;
            this.cont = 0;
            this.pesocasa = 0;
            this.pesopecas = 0;
            this.contagemdepecas = 0;
            this.quantidadedecasas = 0;
            this.ultimafileira = 0;
            this.individuo = individuo3;
            

            Tabuleiro.calculapeso();
            
            for (let i of pecassimuladas)
            {
                
                if(i.peso!=0){
                    this.soma = this.soma + i.peso*pesocasas[i.posicao[0]][i.posicao[1]];
                    }
                    this.cont++;
            }


            this.soma = this.pesocasa + this.pesopecas + this.contagemdepecas + this.quantidadedecasas + this.ultimafileira;
            return this.soma;

        },
        calculapeso: function (){
            
            for (let i of pecassimuladas){
                if(i.peso != 0){
                    i.peso = 5;
                if (i.rainha) {            
                    i.peso = 10;}
                else if (!i.rainha &&i.jogador == 1){
                    if(i.posicao[0] == 6) i.peso = 7;
                }
        
                else if (!i.rainha && i.jogador == 2){
                    if(i.posicao[0] == 1) i.peso =  7;
                }
                if (i.jogador == 2) {
                i.peso = i.peso*(-1);
                }}
            }},

        iniciar: function() {
            this.ia = new ia(Tabuleiro, pecas);
            var contarpecas = 0;
            var contarcasas = 0;
            for(let linha in this.tabuleiro){
                for(let coluna in this.tabuleiro[linha]){
                    if (linha % 2 == 1){
                        if (coluna % 2 == 0){
                            contarcasas = this.exibircasas(linha, coluna, contarcasas)
                            
                        }
                    } else {
                        if (coluna % 2 == 1){
                            contarcasas = this.exibircasas(linha, coluna, contarcasas)
                        }
                    }
                    if( this.tabuleiro[linha][coluna] == 1){
                        contarpecas = this.exibirpecas(1, linha, coluna, contarpecas)
                    } else if (this.tabuleiro[linha][coluna] == 2){
                        contarpecas = this.exibirpecas(2, linha, coluna, contarpecas)
                    }
                }
            }
        },
        iniciarsimulacao: function(individuo2){
            this.individuo = JSON.parse(JSON.stringify( individuo2));
            this.tabuleiro =JSON.parse(JSON.stringify( this.individuo.tabuleirojogo2));;
            
            var contarpecas = 0;
            var contarcasas = 0;
            for(let linha in this.tabuleiro){
                for(let coluna in this.tabuleiro[linha]){
                    if (linha % 2 == 1){
                        if (coluna % 2 == 0){
                            contarcasas = this.simularcasas(linha, coluna, contarcasas)
                            
                        }
                    } else {
                        if (coluna % 2 == 1){
                            contarcasas = this.simularcasas(linha, coluna, contarcasas)
                        }
                    }
                    if( this.tabuleiro[linha][coluna] == 1){
                        contarpecas = this.simularpecas(1, linha, coluna, contarpecas)
                    } else if (this.tabuleiro[linha][coluna] == 2){
                        contarpecas = this.simularpecas(2, linha, coluna, contarpecas)
                    }
                }
            
            }
            
            this.individuo.forca = Tabuleiro.forcatabuleiro();
            return this.individuo.forca;
        
        },
        exibircasas: function (linha, coluna, contarcasas){
            this.casasitem.append("<div class='casa' id='casa" + contarcasas + "' style='top:" + this.dictionary[linha] + ";left:" + this.dictionary[coluna] + ";'></div");
            casas[contarcasas]=new Casa($("#casa" + contarcasas), [parseInt(linha), parseInt(coluna)]);
            return contarcasas +1
        },

        simularcasas: function(linha,coluna,contarcasas){
            casassimuladas[contarcasas]=new Casa($("#casa" + contarcasas), [parseInt(linha), parseInt(coluna)]);
            return contarcasas +1
        },

        simularpecas: function(numerojogador, linha, coluna, contarpecas){
            pecassimuladas[contarpecas] = new Peca($("#" + contarpecas), [parseInt(linha), parseInt(coluna)]);
            return contarpecas + 1;
        },

        exibirpecas: function (numerojogador, linha, coluna, contarpecas){
            $(`.jogador${numerojogador}pecas`).append("<div class='peca' id='" + contarpecas + "' style='top:" + this.dictionary[linha] + ";left:" + this.dictionary[coluna] + ";'></div>");
            pecas[contarpecas] = new Peca($("#" + contarpecas), [parseInt(linha), parseInt(coluna)]);
            return contarpecas + 1;
        },

        casavalida: function (linha, coluna) {
            if (linha < 0 || linha > 7 || coluna < 0 || coluna > 7) return false;
            if (this.tabuleiro[linha][coluna] == 0){
                return true;
            }
            return false;
        },
        
        trocavezjogador: function (){
            console.log("tamo trocando de vez",this.jogadoratual)
            if(this.jogadoratual == 1){                
                this.jogadoratual = 2;
                $('.jogada').css("background", "linear-gradient(to right, transparent 50%, #6ad40d 50%)");
                this.ia.gerajogadas();
                //this.ia.iamove();
                
                    }
            else{
            this.jogadoratual = 1;
                $('.jogada').css("background", "linear-gradient(to right, #6ad40d 50%, transparent 50%)");
                   
            }
            this.sesalto()
            
            return;
        },
        checavencedor: function(){
            if (this.placar.jogador1 == 12){
                return 1;
            } else if (this.placar.jogador2 == 12){
                return 2;
            }
            return false;
        },

        limpar: function (){
            location.reload();
        },
        
        sesalto: function () {
            this.capturaobrigatoria = false
            this.capturamultipla = false;
            for (let i of pecas){
                i.permitidomover = false;
                if (i.posicao.length != 0 && i.jogador == this.jogadoratual && i.checarpulos()){
                    this.capturaobrigatoria = true
                    i.permitidomover = true;
                }
            }
            if(!this.capturaobrigatoria){
                for(let i of pecas) i.permitidomover = true;
            }
        },
        
        //???
        str_board: function () {
            ret = ""
            for (let i in this.board) {
              for (let j in this.board[i]) {
                var found = false
                for (let k of pieces) {
                  if (k.position[0] == i && k.position[1] == j) {
                    if (k.king) ret += (this.board[i][j] + 2)
                    else ret += this.board[i][j]
                    found = true
                    break
                  }
                }
                if (!found) ret += '0'
              }
            }
            return ret
          }        
    }

    Tabuleiro.iniciar();

    $('.peca').on("click", function (){
        var vezjogador = ($(this).parent().attr("class").split(' ')[0] == "jogador" + Tabuleiro.jogadoratual + "pecas");
        console.log("vez jogador= ",$(this).attr('id'))
        if(vezjogador){
           cliquePeca($(this).attr('id'))
        }
    });

    $('#reiniciar').on("click", function (){
        Tabuleiro.limpar();
    });

    $('.casa').on("click", function(){
        if($('.selecionada').length !=0){
            var casaid = $(this).attr("id").replace(/casa/, '');
            var casa = casas[casaid];
            var peca = pecas[$('.selecionada').attr("id")];
            cliqueCasa(casa,peca);
        }
        
    });
    function cliquePeca(i){
        var selecionada;
        if(!Tabuleiro.capturamultipla && pecas[i].permitidomover){
            if($('#'+i). hasClass('selecionada')) selecionada = true;
            $('.peca').each(function (index){
                $('.peca').eq(index).removeClass('selecionada')
            });
            if (!selecionada) {
                $('#'+i).addClass('selecionada');
            }
        } else {
            let permitido = "salto existe apenas para outras pecas, nao e permitido mover essa"
            let multiplos = "salto continuo existe , voce precisa mover a mesma peca"
            let mensagem = !Tabuleiro.capturamultipla ? permitido : multiplos
            console.log(mensagem)
        }
    }
    function cliqueCasa(casa,peca){
        var alcance = casa.alcance(peca);
        console.log("tamo aquiuuiui")
        if(alcance != 'invalido') {
            if (alcance == 'salto'){    
                if (peca.capturaradversario(casa)){
                    
                    peca.mover(casa);
                    
                    if(peca.checarpulos()){
                        peca.item.addClass('selecionada');
                        Tabuleiro.capturamultipla = true;
                    } else {
                        Tabuleiro.trocavezjogador()
                    }
                }
            } else if (alcance == 'regular' && !Tabuleiro.capturaobrigatoria){
                if(!peca.checarpulos()){
                    peca.mover(casa);
                    Tabuleiro.trocavezjogador()
                } else {
                    alert("Voce deve capturar adversario quando possivel");
                }
            }
        }
    }
    function ia(Tabuleiro, pecas){
        this.Tabuleiro = Tabuleiro;
        this.pecas = pecas;
        this.aleatorio = 0;
        this.aux = 0;
        
        

      
        this.iamove = function(){
            //this.pecas[12].mover(casas[16]);
            console.log("Força do Tabuleiro:",Tabuleiro.forcatabuleiro());
            this.aleatorio = Math.floor((Math.random()*12)+12);
            this.aux = 0;
            this.cont = -1;
            this.menor=999;
            this.casaescolhida;
            var possibilidades = [];
            Tabuleiro.sesalto();
            if(Tabuleiro.capturaobrigatoria){
            for(let  i of pecas){
                this.cont++;
                if(this.cont>11){
                for(let j of casas){
                    
                    var alcance2 = j.alcance(i); 
                    if (alcance2 == "salto"){
                        cliquePeca(this.cont);
                        cliqueCasa(j,i);
                       if(i.checarpulos())
                            for(k of casas){
                                var alcance3 = k.alcance(i);
                                if (alcance3 == "salto"){
                                cliquePeca(this.cont);
                                cliqueCasa(k,i); }  
                            }
                        this.aux = 1; 
                    }
                }}
            }}
            else{
            //this.gerajogadas();    
            //verificar fim de jogo
          while(this.aux != 1){                    
                    this.aleatorio = Math.floor((Math.random()*12)+12);
                    this.cont = 0;
                    for(let j of casas){
                        var alcance2 = j.alcance(this.pecas[this.aleatorio]);
                        if (alcance2 == "regular"){
                            individuo.casa = j;
                            individuo.peso = this.pecas[this.aleatorio].peso*pesocasas[j.posicao[0]][j.posicao[1]];
                            individuo.peca = this.aleatorio;
                            possibilidades[this.cont] = individuo;
                            this.cont++;
                            cliquePeca(this.aleatorio);
                            cliqueCasa(j,this.pecas[this.aleatorio]);
                            this.aux = 1;  
                        }     
                    }
                    this.cont= 0;
                    
                    if(possibilidades.length > 0){
                    for (let i of possibilidades){
                        if (i.peso < this.menor) {
                            this.casaescolhida=i.casa;
                            this.menor= i.peso;
                        }
                    }

                    cliquePeca(this.aleatorio);
                    cliqueCasa(this.casaescolhida,this.pecas[this.aleatorio]);
                    this.aux = 1;

                }
                    

                    
            }
        }
            }
       this.popinicial = function(){
        this.vetor = [];
        this.aux = -1;
        while(this.aux == -1){    
            for(let i=0;i<5;i++){
                this.vetor[i] = Math.round((Math.random()))
                
            }
            this.aux = this.vetor.indexOf(1);
            }
        return this.vetor;
        }
        //console.log("primeira geração completa: ",primeirageracao)
       

       this.contagemdepecas = function() {
            return ((Tabuleiro.placar.jogador1-Tabuleiro.placar.jogador2)*2)
       }
       this.contagemcasasvalidas = function(){
           this.casas = casas;
           this.pecas = pecas;
           this.cont1 = 0;
           this.cont2 = 0;
           for(let i of this.pecas){
               for(let j of this.casas){
                   var aux = j.alcance(i)
                   if (i.jogador == 1 & aux != "invalido") this.cont1++;
                   else if (i.jogador == 2 & aux != "invalido") this.cont2;
               }
           }
           return this.cont1 - this.cont2;
       }

       this.ultimafila = function(tab){
        this.tabuleiro = tab;
        this.cont1 = 0;
        this.cont2 = 0;
        for(i=0;i<8;i++){
            for(j=0;j<8;j++){
                if(i==0 && this.tabuleiro[i][j]==1)this.cont1++;
                if(i==7 && this.tabuleiro[i][j]==2)this.cont2++;
            }
        }
        return this.cont1 - this.cont2;
       }


       this.gerajogadas = function(){
           this.tabuleiro = Tabuleiro.tabuleiro;
            this.cont = 0;
            this.cont2 = -1;
            this.pecas = pecas;
            for (let i of this.pecas){
                for(let j of casas){
                    var alcance2 = j.alcance(i);
                    if(i.jogador == 2){
                        if (alcance2 == "regular"){
                            individuo.tabuleirojogo2 = JSON.parse(JSON.stringify(this.tabuleiro));
                            //perfect até aqui ^.^ linha anterior
                            individuo.tabuleirojogo2[j.posicao[0]][j.posicao[1]] = 2;
                            individuo.tabuleirojogo2[i.posicao[0]][i.posicao[1]] = 0;
                            individuo.peca = this.cont2++;
                            individuo.casa = j; 
                            individuo.avaliacao = this.popinicial();
                            individuos[this.cont] = jQuery.extend(true, {}, individuo)
                            this.cont++;
                        }
                    }
                  
                }
                this.cont2++;
            }
         for(let i of individuos){
             console.log("avaliacao: ",i.avaliacao);
             //i.forca = Tabuleiro.iniciarsimulacao(i)
             //console.log("Forca simulada:  ",i.forca)

         }  
        individuos.sort(function(a, b) {
            return parseFloat(a.forca) - parseFloat(b.forca);
        }); 
        console.log("peca escolhida: ",this.pecas[individuos[0].peca])
        console.log("casa escolhida: ",individuos[0].casa)
        cliquePeca(individuos[0].peca);
        cliqueCasa(individuos[0].casa, this.pecas[individuos[0].peca]);
        }
        
    }
}    
