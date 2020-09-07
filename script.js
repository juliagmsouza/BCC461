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
  ];
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

    var pecas = [];
    var casas = [];

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

    this.calculapeso = function (){
        if (this.rainha) 
            this.peso = 10;
        
        else if (!this.rainha && this.jogador == 1){
            if(this.posicao[0] == 6) this.peso = 7;
        }

        else if (!this.rainha && this.jogador == 2){
            if(this.posicao[0] == 1) this.peso = 7;
        }

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
            this.calculapeso(); 
            console.log("pesoooo ",this.peso);
            if(this.jogador == 2){
                //Tabuleiro.trocavezjogador();
            }
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
                return 'salto'
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
        exibircasas: function (linha, coluna, contarcasas){
            this.casasitem.append("<div class='casa' id='casa" + contarcasas + "' style='top:" + this.dictionary[linha] + ";left:" + this.dictionary[coluna] + ";'></div");
            casas[contarcasas]=new Casa($("#casa" + contarcasas), [parseInt(linha), parseInt(coluna)]);
            return contarcasas +1
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
            
            if(this.jogadoratual == 1){                
                this.jogadoratual = 2;
                this.ia.iamove();  
                
                $('.jogada').css("background", "linear-gradient(to right, transparent 50%, #16A8C7 50%)");
            }
            else{
                
                this.jogadoratual = 1;
                $('.jogada').css("background", "linear-gradient(to right,#16A8C7 50%, transparent 50%)");
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
        var selecionada;
        var vezjogador = ($(this).parent().attr("class").split(' ')[0] == "jogador" + Tabuleiro.jogadoratual + "pecas");
        
        if(vezjogador){
            if(!Tabuleiro.capturamultipla && pecas[$(this).attr("id")].permitidomover){
                if($(this). hasClass('selecionada')) selecionada = true;
                $('.peca').each(function (index){
                    $('.peca').eq(index).removeClass('selecionada')
                });
                if (!selecionada) {
                    $(this).addClass('selecionada');
                }
            } else {
                let permitido = "salto existe apenas para outras pecas, nao e permitido mover essa"
                let multiplos = "salto continuo existe , voce precisa mover a mesma peca"
                let mensagem = !Tabuleiro.capturamultipla ? permitido : multiplos
                console.log(mensagem)
            }
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
            var alcance = casa.alcance(peca);
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
    });

    function ia(Tabuleiro, pecas){
        this.Tabuleiro = Tabuleiro;
        this.pecas = pecas;
        this.aleatorio = 0;
        this.aux = 0;

        

        if(this.jogadoratual==2){
            this.Tabuleiro.sesalto();
        }

        this.iamove = function(){
            
            //this.pecas[12].mover(casas[16]);
            this.aleatorio = Math.floor((Math.random()*12)+12);
                while(this.aux != 1){                    
                    this.aleatorio = Math.floor((Math.random()*12)+12);
                    
                    for(let j of casas){
                        var alcance2 = j.alcance(this.pecas[this.aleatorio]);
                        console.log("eu ", this.aleatorio)
                        if (alcance2 = "regular"){
                            this.pecas[this.aleatorio].mover(j);
                            Tabuleiro.trocavezjogador();
                            this.aux = 1;
                            
                        }
                    }
                    
                }
            }
        }

    }
