import React, { useState, useEffect } from 'react';
import { Globe, Wallet, CheckCircle, AlertCircle, ExternalLink, Copy, Zap, Shield } from 'lucide-react';

const NFTDomainWrapper = () => {
  const [domainInput, setDomainInput] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [mintedNFTs, setMintedNFTs] = useState([]);
  const [isValidating, setIsValidating] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const [mintSuccess, setMintSuccess] = useState(false);
  const [currentTokenId, setCurrentTokenId] = useState(1001);

  // Mock wallet connection
  const connectWallet = () => {
    setIsConnected(true);
    setWalletAddress('0x742d35Cc6634C0532925a3b8D4C7fA2C6f1e8b2A');
  };

  // Validate domain format
  const validateDomain = (domain) => {
    const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?\.[a-zA-Z]{2,}$/;
    return domainRegex.test(domain);
  };

  // Mock minting process
  const mintDomainNFT = async () => {
    if (!validateDomain(domainInput)) {
      alert('Please enter a valid domain name (e.g., mybrand.com)');
      return;
    }

    // Check if domain already minted
    const alreadyMinted = mintedNFTs.some(nft => nft.domain.toLowerCase() === domainInput.toLowerCase());
    if (alreadyMinted) {
      alert('This domain has already been wrapped as an NFT!');
      return;
    }

    setIsMinting(true);
    
    // Simulate blockchain transaction
    setTimeout(() => {
      const newNFT = {
        tokenId: currentTokenId,
        domain: domainInput,
        owner: walletAddress,
        mintedAt: new Date().toISOString(),
        txHash: `0x${Math.random().toString(16).substring(2, 66)}`,
        metadata: {
          name: `Domain NFT: ${domainInput}`,
          description: `NFT representing ownership of ${domainInput} domain`,
          domain: domainInput,
          wrapped_at: new Date().toISOString(),
          attributes: [
            { trait_type: "Domain Length", value: domainInput.length },
            { trait_type: "TLD", value: domainInput.split('.').pop().toUpperCase() },
            { trait_type: "Has Subdomain", value: domainInput.split('.').length > 2 ? "Yes" : "No" },
            { trait_type: "Wrapped Date", value: new Date().toLocaleDateString() }
          ]
        }
      };

      setMintedNFTs(prev => [newNFT, ...prev]);
      setCurrentTokenId(prev => prev + 1);
      setIsMinting(false);
      setMintSuccess(true);
      setDomainInput('');

      setTimeout(() => setMintSuccess(false), 3000);
    }, 2500);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const NFTCard = ({ nft }) => (
    <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 backdrop-blur-sm border border-purple-500/30 rounded-xl p-6 hover:border-purple-400/50 transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
            <Globe className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">{nft.domain}</h3>
            <p className="text-purple-300 text-sm">Token ID: #{nft.tokenId}</p>
          </div>
        </div>
        <div className="text-green-400 bg-green-400/20 px-2 py-1 rounded-full text-xs font-medium">
          MINTED
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Owner:</span>
          <div className="flex items-center gap-2">
            <span className="text-white font-mono text-xs">
              {nft.owner.substring(0, 6)}...{nft.owner.substring(38)}
            </span>
            <button 
              onClick={() => copyToClipboard(nft.owner)}
              className="text-purple-400 hover:text-purple-300"
            >
              <Copy className="w-3 h-3" />
            </button>
          </div>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">TLD:</span>
          <span className="text-white">.{nft.domain.split('.').pop()}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Minted:</span>
          <span className="text-white">{new Date(nft.mintedAt).toLocaleDateString()}</span>
        </div>
      </div>

      <div className="flex gap-2">
        <button 
          onClick={() => copyToClipboard(nft.txHash)}
          className="flex-1 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 text-purple-300 px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
        >
          <ExternalLink className="w-3 h-3" />
          View TX
        </button>
        <button className="flex-1 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-300 px-3 py-2 rounded-lg text-sm transition-colors">
          Transfer
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950/30 to-blue-950/20 text-white p-6">
      {/* Header */}
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
              <Globe className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              NFT Domain Wrapper
            </h1>
          </div>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Transform any domain into an NFT. Mint, own, and trade domain names as blockchain assets with full ownership rights.
          </p>
        </div>

        {/* Success Message */}
        {mintSuccess && (
          <div className="max-w-md mx-auto mb-6 bg-green-900/20 border border-green-500/30 rounded-xl p-4 flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <span className="text-green-300">Domain NFT minted successfully!</span>
          </div>
        )}

        {/* Main Interface */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8">
            {/* Wallet Connection */}
            {!isConnected ? (
              <div className="text-center">
                <div className="mb-6">
                  <Wallet className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Connect Your Wallet</h3>
                  <p className="text-gray-400">Connect your wallet to start minting domain NFTs</p>
                </div>
                <button
                  onClick={connectWallet}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 px-8 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center gap-2 mx-auto"
                >
                  <Wallet className="w-5 h-5" />
                  Connect Wallet
                </button>
              </div>
            ) : (
              <div>
                {/* Connected Wallet Info */}
                <div className="bg-green-900/20 border border-green-500/30 rounded-xl p-4 mb-6 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-green-300 font-medium">Wallet Connected</p>
                      <p className="text-green-400 text-sm font-mono">
                        {walletAddress.substring(0, 6)}...{walletAddress.substring(38)}
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => copyToClipboard(walletAddress)}
                    className="text-green-400 hover:text-green-300"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>

                {/* Domain Input */}
                <div className="mb-6">
                  <label className="block text-gray-300 font-medium mb-3">
                    Enter Domain Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={domainInput}
                      onChange={(e) => setDomainInput(e.target.value.toLowerCase())}
                      placeholder="mybrand.com"
                      className="w-full bg-gray-800 border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none transition-colors"
                      disabled={isMinting}
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <Globe className="w-5 h-5 text-gray-500" />
                    </div>
                  </div>
                  {domainInput && !validateDomain(domainInput) && (
                    <div className="flex items-center gap-2 mt-2 text-red-400 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      Please enter a valid domain (e.g., example.com)
                    </div>
                  )}
                </div>

                {/* Features */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-3 text-center">
                    <Shield className="w-5 h-5 text-purple-400 mx-auto mb-1" />
                    <p className="text-purple-300 text-sm">Secure Ownership</p>
                  </div>
                  <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-3 text-center">
                    <Zap className="w-5 h-5 text-blue-400 mx-auto mb-1" />
                    <p className="text-blue-300 text-sm">Instant Minting</p>
                  </div>
                  <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-3 text-center">
                    <ExternalLink className="w-5 h-5 text-green-400 mx-auto mb-1" />
                    <p className="text-green-300 text-sm">Tradeable NFT</p>
                  </div>
                </div>

                {/* Mint Button */}
                <button
                  onClick={mintDomainNFT}
                  disabled={isMinting || !domainInput || !validateDomain(domainInput)}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2"
                >
                  {isMinting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Minting NFT...
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5" />
                      Mint Domain NFT
                    </>
                  )}
                </button>

                <p className="text-gray-400 text-center text-sm mt-3">
                  Gas fee: ~0.002 ETH • Processing time: ~30 seconds
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Minted NFTs */}
        {mintedNFTs.length > 0 && (
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Globe className="w-6 h-6 text-purple-400" />
              Your Domain NFTs ({mintedNFTs.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mintedNFTs.map((nft) => (
                <NFTCard key={nft.tokenId} nft={nft} />
              ))}
            </div>
          </div>
        )}

        {/* Info Section */}
        <div className="max-w-4xl mx-auto mt-12 bg-gray-900/30 backdrop-blur-sm border border-gray-700 rounded-2xl p-8">
          <h3 className="text-xl font-semibold mb-4">How It Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="w-12 h-12 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-purple-400 font-bold">1</span>
              </div>
              <h4 className="font-medium mb-2">Enter Domain</h4>
              <p className="text-gray-400 text-sm">Input any domain name you want to wrap as an NFT</p>
            </div>
            <div>
              <div className="w-12 h-12 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-purple-400 font-bold">2</span>
              </div>
              <h4 className="font-medium mb-2">Mint NFT</h4>
              <p className="text-gray-400 text-sm">Smart contract mints an NFT representing domain ownership</p>
            </div>
            <div>
              <div className="w-12 h-12 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-purple-400 font-bold">3</span>
              </div>
              <h4 className="font-medium mb-2">Own & Trade</h4>
              <p className="text-gray-400 text-sm">Trade, transfer, or use your domain NFT in DeFi protocols</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NFTDomainWrapper;