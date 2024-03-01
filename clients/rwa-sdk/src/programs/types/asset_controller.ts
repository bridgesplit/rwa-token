export type AssetController = {
  "version": "0.0.1",
  "name": "asset_controller",
  "instructions": [
    {
      "name": "createAssetController",
      "docs": [
        "create an rwa asset"
      ],
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "assetMint",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "assetController",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "extraMetasAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": "CreateAssetControllerArgs"
          }
        }
      ]
    },
    {
      "name": "issueTokens",
      "docs": [
        "issue shares of the rwa asset"
      ],
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true,
          "docs": [
            "only authority can issue tokens"
          ]
        },
        {
          "name": "transactionApprovalAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "assetMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": "IssueTokensArgs"
          }
        }
      ]
    },
    {
      "name": "voidTokens",
      "docs": [
        "void shares of the rwa asset"
      ],
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "owner",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "transactionApprovalAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "assetMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "createTokenAccount",
      "docs": [
        "create a token account"
      ],
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "owner",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "transactionApprovalAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "assetMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "trackerAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "closeTokenAccount",
      "docs": [
        "close a token account"
      ],
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "owner",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "transactionApprovalAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "assetMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "approveTransaction",
      "docs": [
        "generate an approve account for a transaction"
      ],
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "signer",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "assetMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "transactionApprovalAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "assetController",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": "ApproveTransactionArgs"
          }
        }
      ]
    },
    {
      "name": "executeTransaction",
      "docs": [
        "execute transfer hook"
      ],
      "accounts": [
        {
          "name": "sourceAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "assetMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "destinationAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "ownerDelegate",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "extraMetasAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "policyEngine",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "policyEngineAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "identityRegistry",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "identityAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "trackerAccount",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "transactionApprovalAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "assetMint",
            "docs": [
              "asset mint"
            ],
            "type": "publicKey"
          },
          {
            "name": "fromTokenAccount",
            "docs": [
              "from token account"
            ],
            "type": {
              "option": "publicKey"
            }
          },
          {
            "name": "toTokenAccount",
            "docs": [
              "to token account"
            ],
            "type": {
              "option": "publicKey"
            }
          },
          {
            "name": "amount",
            "docs": [
              "amount to be transferred"
            ],
            "type": {
              "option": "u64"
            }
          },
          {
            "name": "slot",
            "docs": [
              "slot in which approve account has been generated"
            ],
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "assetControllerAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "version",
            "type": "u8"
          },
          {
            "name": "assetMint",
            "docs": [
              "mint pubkey"
            ],
            "type": "publicKey"
          },
          {
            "name": "authority",
            "docs": [
              "authority has the ability to change delegate, freeze token accounts, etc."
            ],
            "type": "publicKey"
          },
          {
            "name": "delegate",
            "docs": [
              "delegate has the ability to generate tranasction approval accounts,",
              "by default points to self, which allows any programs to generate an approval account",
              "update to any other account to control cpis"
            ],
            "type": "publicKey"
          }
        ]
      }
    },
    {
      "name": "trackerAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "version",
            "type": "u8"
          },
          {
            "name": "assetMint",
            "type": "publicKey"
          },
          {
            "name": "owner",
            "type": "publicKey"
          },
          {
            "name": "transferAmounts",
            "type": {
              "array": [
                "u64",
                10
              ]
            }
          },
          {
            "name": "transferTimestamps",
            "type": {
              "array": [
                "i64",
                10
              ]
            }
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "CreateAssetControllerArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "decimals",
            "type": "u8"
          },
          {
            "name": "authority",
            "type": "publicKey"
          },
          {
            "name": "delegate",
            "type": {
              "option": "publicKey"
            }
          }
        ]
      }
    },
    {
      "name": "ApproveTransactionArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "fromTokenAccount",
            "type": {
              "option": "publicKey"
            }
          },
          {
            "name": "toTokenAccount",
            "type": {
              "option": "publicKey"
            }
          },
          {
            "name": "amount",
            "type": {
              "option": "u64"
            }
          }
        ]
      }
    },
    {
      "name": "IssueTokensArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "to",
            "type": "publicKey"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "TransferMintNotApproved",
      "msg": "Transfer hasnt been approved for the asset mint"
    },
    {
      "code": 6001,
      "name": "TransferFromNotApproved",
      "msg": "Transfer hasnt been approved for from account"
    },
    {
      "code": 6002,
      "name": "TransferToNotApproved",
      "msg": "Transfer hasnt been approved for to account"
    },
    {
      "code": 6003,
      "name": "TransferAmountNotApproved",
      "msg": "Transfer hasnt been approved for the specified amount"
    },
    {
      "code": 6004,
      "name": "PolicyAccountsMissing",
      "msg": "All policy accounts must be sent in the instruction"
    },
    {
      "code": 6005,
      "name": "InvalidPolicyAccount",
      "msg": "Invalid policy account passed"
    },
    {
      "code": 6006,
      "name": "TransferSlotNotApproved",
      "msg": "Invalid slot for approve account"
    },
    {
      "code": 6007,
      "name": "TransferHistoryFull",
      "msg": "Transfer history is full"
    },
    {
      "code": 6008,
      "name": "Unauthorized",
      "msg": "Unauthorized"
    }
  ]
};

export const IDL: AssetController = {
  "version": "0.0.1",
  "name": "asset_controller",
  "instructions": [
    {
      "name": "createAssetController",
      "docs": [
        "create an rwa asset"
      ],
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "assetMint",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "assetController",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "extraMetasAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": "CreateAssetControllerArgs"
          }
        }
      ]
    },
    {
      "name": "issueTokens",
      "docs": [
        "issue shares of the rwa asset"
      ],
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true,
          "docs": [
            "only authority can issue tokens"
          ]
        },
        {
          "name": "transactionApprovalAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "assetMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": "IssueTokensArgs"
          }
        }
      ]
    },
    {
      "name": "voidTokens",
      "docs": [
        "void shares of the rwa asset"
      ],
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "owner",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "transactionApprovalAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "assetMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "createTokenAccount",
      "docs": [
        "create a token account"
      ],
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "owner",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "transactionApprovalAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "assetMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "trackerAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "closeTokenAccount",
      "docs": [
        "close a token account"
      ],
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "owner",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "transactionApprovalAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "assetMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "approveTransaction",
      "docs": [
        "generate an approve account for a transaction"
      ],
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "signer",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "assetMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "transactionApprovalAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "assetController",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": "ApproveTransactionArgs"
          }
        }
      ]
    },
    {
      "name": "executeTransaction",
      "docs": [
        "execute transfer hook"
      ],
      "accounts": [
        {
          "name": "sourceAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "assetMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "destinationAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "ownerDelegate",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "extraMetasAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "policyEngine",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "policyEngineAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "identityRegistry",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "identityAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "trackerAccount",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "transactionApprovalAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "assetMint",
            "docs": [
              "asset mint"
            ],
            "type": "publicKey"
          },
          {
            "name": "fromTokenAccount",
            "docs": [
              "from token account"
            ],
            "type": {
              "option": "publicKey"
            }
          },
          {
            "name": "toTokenAccount",
            "docs": [
              "to token account"
            ],
            "type": {
              "option": "publicKey"
            }
          },
          {
            "name": "amount",
            "docs": [
              "amount to be transferred"
            ],
            "type": {
              "option": "u64"
            }
          },
          {
            "name": "slot",
            "docs": [
              "slot in which approve account has been generated"
            ],
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "assetControllerAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "version",
            "type": "u8"
          },
          {
            "name": "assetMint",
            "docs": [
              "mint pubkey"
            ],
            "type": "publicKey"
          },
          {
            "name": "authority",
            "docs": [
              "authority has the ability to change delegate, freeze token accounts, etc."
            ],
            "type": "publicKey"
          },
          {
            "name": "delegate",
            "docs": [
              "delegate has the ability to generate tranasction approval accounts,",
              "by default points to self, which allows any programs to generate an approval account",
              "update to any other account to control cpis"
            ],
            "type": "publicKey"
          }
        ]
      }
    },
    {
      "name": "trackerAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "version",
            "type": "u8"
          },
          {
            "name": "assetMint",
            "type": "publicKey"
          },
          {
            "name": "owner",
            "type": "publicKey"
          },
          {
            "name": "transferAmounts",
            "type": {
              "array": [
                "u64",
                10
              ]
            }
          },
          {
            "name": "transferTimestamps",
            "type": {
              "array": [
                "i64",
                10
              ]
            }
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "CreateAssetControllerArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "decimals",
            "type": "u8"
          },
          {
            "name": "authority",
            "type": "publicKey"
          },
          {
            "name": "delegate",
            "type": {
              "option": "publicKey"
            }
          }
        ]
      }
    },
    {
      "name": "ApproveTransactionArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "fromTokenAccount",
            "type": {
              "option": "publicKey"
            }
          },
          {
            "name": "toTokenAccount",
            "type": {
              "option": "publicKey"
            }
          },
          {
            "name": "amount",
            "type": {
              "option": "u64"
            }
          }
        ]
      }
    },
    {
      "name": "IssueTokensArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "to",
            "type": "publicKey"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "TransferMintNotApproved",
      "msg": "Transfer hasnt been approved for the asset mint"
    },
    {
      "code": 6001,
      "name": "TransferFromNotApproved",
      "msg": "Transfer hasnt been approved for from account"
    },
    {
      "code": 6002,
      "name": "TransferToNotApproved",
      "msg": "Transfer hasnt been approved for to account"
    },
    {
      "code": 6003,
      "name": "TransferAmountNotApproved",
      "msg": "Transfer hasnt been approved for the specified amount"
    },
    {
      "code": 6004,
      "name": "PolicyAccountsMissing",
      "msg": "All policy accounts must be sent in the instruction"
    },
    {
      "code": 6005,
      "name": "InvalidPolicyAccount",
      "msg": "Invalid policy account passed"
    },
    {
      "code": 6006,
      "name": "TransferSlotNotApproved",
      "msg": "Invalid slot for approve account"
    },
    {
      "code": 6007,
      "name": "TransferHistoryFull",
      "msg": "Transfer history is full"
    },
    {
      "code": 6008,
      "name": "Unauthorized",
      "msg": "Unauthorized"
    }
  ]
};
