export type PolicyEngine = {
  "version": "0.0.1",
  "name": "policy_engine",
  "instructions": [
    {
      "name": "createPolicyEngine",
      "docs": [
        "create a policy registry"
      ],
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "assetMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "policyEngine",
          "isMut": true,
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
    },
    {
      "name": "createPolicyAccount",
      "docs": [
        "policies",
        "create policy account"
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
          "name": "policyEngine",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "policyAccount",
          "isMut": true,
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
          "name": "identityFilter",
          "type": {
            "defined": "IdentityFilter"
          }
        },
        {
          "name": "policyType",
          "type": {
            "defined": "PolicyType"
          }
        }
      ]
    },
    {
      "name": "attachToPolicyAccount",
      "docs": [
        "attach a policy"
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
          "name": "policyEngine",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "policyAccount",
          "isMut": true,
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
          "name": "identityFilter",
          "type": {
            "defined": "IdentityFilter"
          }
        },
        {
          "name": "policyType",
          "type": {
            "defined": "PolicyType"
          }
        }
      ]
    },
    {
      "name": "detachFromPolicyAccount",
      "docs": [
        "remove policy"
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
          "name": "policyEngine",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "policyAccount",
          "isMut": true,
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
          "name": "policyType",
          "type": {
            "defined": "PolicyType"
          }
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "policyAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "version",
            "type": "u8"
          },
          {
            "name": "policyEngine",
            "docs": [
              "Engine account that the policy belongs to"
            ],
            "type": "publicKey"
          },
          {
            "name": "policies",
            "docs": [
              "Different policies that can be applied to the policy account"
            ],
            "type": {
              "vec": {
                "defined": "Policy"
              }
            }
          }
        ]
      }
    },
    {
      "name": "policyEngineAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "version",
            "docs": [
              "version"
            ],
            "type": "u8"
          },
          {
            "name": "assetMint",
            "docs": [
              "asset mint"
            ],
            "type": "publicKey"
          },
          {
            "name": "authority",
            "docs": [
              "authority of the registry"
            ],
            "type": "publicKey"
          },
          {
            "name": "delegate",
            "docs": [
              "policy delegate"
            ],
            "type": "publicKey"
          },
          {
            "name": "maxTimeframe",
            "docs": [
              "max timeframe of all the policies"
            ],
            "type": "i64"
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "IdentityFilter",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "identityLevels",
            "type": {
              "array": [
                "u8",
                10
              ]
            }
          },
          {
            "name": "comparisionType",
            "type": {
              "defined": "ComparisionType"
            }
          }
        ]
      }
    },
    {
      "name": "Policy",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "policyType",
            "type": {
              "defined": "PolicyType"
            }
          },
          {
            "name": "identityFilter",
            "type": {
              "defined": "IdentityFilter"
            }
          }
        ]
      }
    },
    {
      "name": "ComparisionType",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Or"
          },
          {
            "name": "And"
          }
        ]
      }
    },
    {
      "name": "PolicyType",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "IdentityApproval"
          },
          {
            "name": "TransactionAmountLimit",
            "fields": [
              {
                "name": "limit",
                "type": "u64"
              }
            ]
          },
          {
            "name": "TransactionAmountVelocity",
            "fields": [
              {
                "name": "limit",
                "type": "u64"
              },
              {
                "name": "timeframe",
                "type": "i64"
              }
            ]
          },
          {
            "name": "TransactionCountVelocity",
            "fields": [
              {
                "name": "limit",
                "type": "u64"
              },
              {
                "name": "timeframe",
                "type": "i64"
              }
            ]
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "InvalidPolicy",
      "msg": "Invalid policy passed"
    },
    {
      "code": 6001,
      "name": "TransactionAmountLimitExceeded",
      "msg": "Transaction amount limit exceeded"
    },
    {
      "code": 6002,
      "name": "TransactionAmountVelocityExceeded",
      "msg": "Transaction amount velocity exceeded"
    },
    {
      "code": 6003,
      "name": "TransactionCountVelocityExceeded",
      "msg": "Transaction count velocity exceeded"
    },
    {
      "code": 6004,
      "name": "PolicyEngineFull",
      "msg": "Policy registry is full, cannot add more policies"
    },
    {
      "code": 6005,
      "name": "PolicyNotFound",
      "msg": "Policy not found"
    },
    {
      "code": 6006,
      "name": "IdentityFilterFailed",
      "msg": "Identity filter failed"
    },
    {
      "code": 6007,
      "name": "UnauthorizedSigner",
      "msg": "Unauthorized signer"
    }
  ]
};

export const IDL: PolicyEngine = {
  "version": "0.0.1",
  "name": "policy_engine",
  "instructions": [
    {
      "name": "createPolicyEngine",
      "docs": [
        "create a policy registry"
      ],
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "assetMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "policyEngine",
          "isMut": true,
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
    },
    {
      "name": "createPolicyAccount",
      "docs": [
        "policies",
        "create policy account"
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
          "name": "policyEngine",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "policyAccount",
          "isMut": true,
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
          "name": "identityFilter",
          "type": {
            "defined": "IdentityFilter"
          }
        },
        {
          "name": "policyType",
          "type": {
            "defined": "PolicyType"
          }
        }
      ]
    },
    {
      "name": "attachToPolicyAccount",
      "docs": [
        "attach a policy"
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
          "name": "policyEngine",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "policyAccount",
          "isMut": true,
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
          "name": "identityFilter",
          "type": {
            "defined": "IdentityFilter"
          }
        },
        {
          "name": "policyType",
          "type": {
            "defined": "PolicyType"
          }
        }
      ]
    },
    {
      "name": "detachFromPolicyAccount",
      "docs": [
        "remove policy"
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
          "name": "policyEngine",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "policyAccount",
          "isMut": true,
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
          "name": "policyType",
          "type": {
            "defined": "PolicyType"
          }
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "policyAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "version",
            "type": "u8"
          },
          {
            "name": "policyEngine",
            "docs": [
              "Engine account that the policy belongs to"
            ],
            "type": "publicKey"
          },
          {
            "name": "policies",
            "docs": [
              "Different policies that can be applied to the policy account"
            ],
            "type": {
              "vec": {
                "defined": "Policy"
              }
            }
          }
        ]
      }
    },
    {
      "name": "policyEngineAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "version",
            "docs": [
              "version"
            ],
            "type": "u8"
          },
          {
            "name": "assetMint",
            "docs": [
              "asset mint"
            ],
            "type": "publicKey"
          },
          {
            "name": "authority",
            "docs": [
              "authority of the registry"
            ],
            "type": "publicKey"
          },
          {
            "name": "delegate",
            "docs": [
              "policy delegate"
            ],
            "type": "publicKey"
          },
          {
            "name": "maxTimeframe",
            "docs": [
              "max timeframe of all the policies"
            ],
            "type": "i64"
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "IdentityFilter",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "identityLevels",
            "type": {
              "array": [
                "u8",
                10
              ]
            }
          },
          {
            "name": "comparisionType",
            "type": {
              "defined": "ComparisionType"
            }
          }
        ]
      }
    },
    {
      "name": "Policy",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "policyType",
            "type": {
              "defined": "PolicyType"
            }
          },
          {
            "name": "identityFilter",
            "type": {
              "defined": "IdentityFilter"
            }
          }
        ]
      }
    },
    {
      "name": "ComparisionType",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Or"
          },
          {
            "name": "And"
          }
        ]
      }
    },
    {
      "name": "PolicyType",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "IdentityApproval"
          },
          {
            "name": "TransactionAmountLimit",
            "fields": [
              {
                "name": "limit",
                "type": "u64"
              }
            ]
          },
          {
            "name": "TransactionAmountVelocity",
            "fields": [
              {
                "name": "limit",
                "type": "u64"
              },
              {
                "name": "timeframe",
                "type": "i64"
              }
            ]
          },
          {
            "name": "TransactionCountVelocity",
            "fields": [
              {
                "name": "limit",
                "type": "u64"
              },
              {
                "name": "timeframe",
                "type": "i64"
              }
            ]
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "InvalidPolicy",
      "msg": "Invalid policy passed"
    },
    {
      "code": 6001,
      "name": "TransactionAmountLimitExceeded",
      "msg": "Transaction amount limit exceeded"
    },
    {
      "code": 6002,
      "name": "TransactionAmountVelocityExceeded",
      "msg": "Transaction amount velocity exceeded"
    },
    {
      "code": 6003,
      "name": "TransactionCountVelocityExceeded",
      "msg": "Transaction count velocity exceeded"
    },
    {
      "code": 6004,
      "name": "PolicyEngineFull",
      "msg": "Policy registry is full, cannot add more policies"
    },
    {
      "code": 6005,
      "name": "PolicyNotFound",
      "msg": "Policy not found"
    },
    {
      "code": 6006,
      "name": "IdentityFilterFailed",
      "msg": "Identity filter failed"
    },
    {
      "code": 6007,
      "name": "UnauthorizedSigner",
      "msg": "Unauthorized signer"
    }
  ]
};
